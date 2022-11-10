import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, ReplaySubject, switchMap } from 'rxjs';
import init, { JsHandle, start } from '../../../assets/webnode/mina-rust';
import { toReadableDate } from '@shared/helpers/date.helper';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import * as base from 'base-x';

@Injectable({
  providedIn: 'root',
})
export class WebNodeService {

  private readonly wasmReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly webNodeEvent$: ReplaySubject<WebNodeLog> = new ReplaySubject<WebNodeLog>(ONE_THOUSAND);
  private readonly backendSubject$: BehaviorSubject<JsHandle> = new BehaviorSubject<JsHandle>(null);

  private wasmAlreadyLoaded: boolean;
  private backend: JsHandle;

  instantiateWasm(): void {
    if (this.wasmAlreadyLoaded) {
      return;
    }
    const basex = base('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
    window['bs58btc'] = {
      encode: (buffer: Uint8Array | number[]) => 'z' + basex.encode(buffer),
      decode: (string: string) => basex.decode(string.substring(1)),
    };

    init('assets/webnode/mina-rust/rust_bg.wasm').then(() => {
      this.wasmReady.next(true);
      this.wasmAlreadyLoaded = true;

      start((newEvent: WebNodeLog) => {
        this.webNodeEvent$.next({
          ...newEvent,
          date: toReadableDate(Date.now()),
        });
      }).then((jsHandle: JsHandle) => {
        this.backend = jsHandle;
        this.backendSubject$.next(jsHandle);
      });
    });
  }

  get wasmIsAlreadyLoaded(): boolean {
    return this.wasmAlreadyLoaded;
  }

  get wasmReady$(): Observable<boolean> {
    return this.wasmReady.pipe(filter(Boolean));
  }

  get logs$(): Observable<WebNodeLog> {
    return this.webNodeEvent$.asObservable();
  }

  get peers$(): Observable<WebNodeLog> {
    return this.webNodeEvent$.asObservable().pipe(
      filter((log: WebNodeLog) => log.data.peer_id && ['PeerConnected', 'PeerDisconnected'].includes(log.type)),
    );
  }

  generateWallet(): any {
    return this.backend.generate_account_keys();
  }

  createTransaction(transaction: WebNodeTransaction): WebNodeTransaction {
    return this.backend.payment_sign_and_inject(transaction);
  }

  getDialer(peerId: string): Observable<any> {
    return this.backendSubject$.asObservable().pipe(
      filter(Boolean),
      switchMap((backend: JsHandle) => backend.manual_connector().dial(peerId)),
    );
  }

  getListener(): Observable<string> {
    return this.backendSubject$.asObservable().pipe(
      filter(Boolean),
      map((backend: JsHandle) => backend.manual_connector().listen()),
    );
  }

  isPeerIdValid(peerId: string): string | null {
    try {
      this.backend.is_peer_id_valid(peerId);
      return null;
    } catch (error) {
      return error.toString();
    }
  }
}
