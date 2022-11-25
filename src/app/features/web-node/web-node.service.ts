import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, from, map, Observable, switchMap } from 'rxjs';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';
import * as base from 'base-x';
import init, { JsHandle, start } from '../../../assets/webnode/mina-rust';
import { toReadableDate } from '@shared/helpers/date.helper';

export const PEER_CONNECTED = 'PeerConnected';
export const PEER_DISCONNECTED = 'PeerDisconnected';

@Injectable({
  providedIn: 'root',
})
export class WebNodeService {

  private readonly wasmReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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

    init('assets/webnode/mina-rust/wasm_bg.wasm').then(() => {
      this.wasmReady.next(true);
      this.wasmAlreadyLoaded = true;

      start().then((jsHandle: JsHandle) => {
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

  get logs$(): Observable<WebNodeLog[]> {
    return this.backendSubject$.asObservable().pipe(
      filter(Boolean),
      switchMap(handle => from(handle.logs_range())),
      map((logs: any[]) => WebNodeService.getWebNodeLog(logs)),
    );
  }

  get peers$(): Observable<WebNodeLog[]> {
    return this.backendSubject$.asObservable().pipe(
      filter(Boolean),
      switchMap(handle => from(handle.logs_range())),
      map((logs: any[]) => logs.filter((log: any) => log.details.peer_id && [PEER_CONNECTED, PEER_DISCONNECTED].includes(log.details.kind))),
      map((logs: any[]) => WebNodeService.getWebNodeLog(logs)),
    );
  }

  private static getWebNodeLog(logs: any[]): WebNodeLog[] {
    return logs.map((log: any) => ({
      id: log.id,
      level: log.level,
      kind: log.details.kind,
      date: toReadableDate(Number(log.details.time) / 1000000),
      summary: log.details.summary,
      peerId: log.details.peer_id,
      data: log.details,
    } as WebNodeLog));
  }

  generateWallet(): any {
    return this.backend.generate_account_keys();
  }

  createTransaction(transaction: WebNodeTransaction): Observable<WebNodeTransaction> {
    return this.backendSubject$.asObservable().pipe(
      filter(Boolean),
      switchMap(handle => from(handle.payment_sign_and_inject(transaction))),
    );
  }

  getDialer(peerId: string): Observable<any> {
    return this.backendSubject$.asObservable().pipe(
      filter(Boolean),
      switchMap((backend: JsHandle) => from(backend.manual_connector().dial(peerId))),
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

  get globalState(): Observable<any> {
    return this.backendSubject$.asObservable().pipe(
      filter(Boolean),
      switchMap(handle => from(handle.global_state_get())),
    );
  }
}
