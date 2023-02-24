import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, filter, from, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';
import * as base from 'base-x';
import { JsHandle, WasmConfig } from '../../../assets/webnode/mina-rust';
import { toReadableDate } from '@shared/helpers/date.helper';
import { WebNodeWasm } from '@shared/types/web-node/web-node-wasm.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ErrorAdd } from '@error-preview/error-preview.actions';
import { addError } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';

export const PEER_CONNECTED = 'PeerConnected';
export const PEER_DISCONNECTED = 'PeerDisconnected';
// import * as wasmFile from '../../../assets/webnode/mina-rust/wasm.js';
// declare var wasmFile: any;

@Injectable({
  providedIn: 'root',
})
export class WebNodeService {

  private readonly wasmReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly backendSubject$: BehaviorSubject<JsHandle> = new BehaviorSubject<JsHandle>(null);

  private wasmAlreadyLoaded: boolean;
  private backend: JsHandle;
  private wasmLoadDestroy$: Subject<any> = new Subject<any>();

  constructor(private zone: NgZone,
              private store: Store<MinaState>) {
    const basex = base('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
    window['bs58btc'] = {
      encode: (buffer: Uint8Array | number[]) => 'z' + basex.encode(buffer),
      decode: (string: string) => basex.decode(string.substring(1)),
    };
  }

  instantiateWasm(wasm: WebNodeWasm): void {
    if (this.wasmAlreadyLoaded) {
      return;
    }
    let tries = 15;
    try {
      const interval = setInterval(() => {
        tries--;
        if (tries === 0) {
          clearInterval(interval);
        }

        const wasm = (window as any).WebnodeWasm;
        if (!!wasm) {
          clearInterval(interval);

          wasm.default('assets/webnode/mina-rust/wasm_bg.wasm').then(async () => {
            this.wasmAlreadyLoaded = true;
            this.wasmReady.next(true);

            const config = new (wasm.WasmConfig)();

            const fetchBytes = (url: string) => fetch(url)
              .then((resp: Response) => resp.arrayBuffer())
              .then((buf: ArrayBuffer) => new Uint8Array(buf));

            const block_verifier_index = fetchBytes('assets/webnode/block_verifier_index.bin');
            const block_verifier_srs = fetchBytes('assets/webnode/block_verifier_srs.bin');

            config.set_block_verifier_index(block_verifier_index);
            config.set_block_verifier_srs(block_verifier_srs);

            wasm.start(config).then((jsHandle: JsHandle) => {
              this.backend = jsHandle;
              this.backendSubject$.next(jsHandle);
            });
          });
        }
      }, 10000);
    } catch (e: any) {
      this.store.dispatch<ErrorAdd>(addError(e, MinaErrorType.GENERIC));
    }
  }

  loadWasm$(): Observable<any> {
    return of((window as any).WebnodeWasm)
      .pipe(
        switchMap((wasm: any) => from(wasm.default('assets/webnode/mina-rust/wasm_bg.wasm')).pipe(map(() => wasm))),
        map((wasm: any) => {
          this.wasmAlreadyLoaded = true;
          this.wasmReady.next(true);

          const config = new (wasm.WasmConfig)();

          const fetchBytes = (url: string) => fetch(url)
            .then((resp: Response) => resp.arrayBuffer())
            .then((buf: ArrayBuffer) => new Uint8Array(buf));

          const block_verifier_index = fetchBytes('assets/webnode/block_verifier_index.bin');
          const block_verifier_srs = fetchBytes('assets/webnode/block_verifier_srs.bin');

          config.set_block_verifier_index(block_verifier_index);
          config.set_block_verifier_srs(block_verifier_srs);
          return { wasm, config };
        }),
        switchMap(({ wasm, config }: { wasm: any, config: WasmConfig }) => from(wasm.start(config))),
        tap((jsHandle: any) => {
          this.backend = jsHandle;
          this.backendSubject$.next(jsHandle as JsHandle);
        }),
        switchMap(() => this.backendSubject$.asObservable()),
        filter(Boolean),
        // tap(() => this.wasmLoadDestroy$.next(void 0)),
      );
  }

  // loadWasm$2(): Observable<any> {
  //   if (this.wasmAlreadyLoaded) {
  //     return EMPTY;
  //   }
  //   let tries = 2;
  //   return timer(0, 5000)
  //     .pipe(
  //       takeUntil(this.wasmLoadDestroy$),
  //       tap(() => {
  //         tries--;
  //         if (tries === 0) {
  //           this.wasmLoadDestroy$.next(void 0);
  //         }
  //       }),
  //       map(() => (window as any).WebnodeWasm),
  //       // switchMap(() => from(import('../../../../src/assets/webnode/mina-rust/wasm.js'))),
  //       filter(Boolean),
  //       tap(() => console.log(wasmFile)),
  //       // switchMap((wasm: any) => from(wasmFile.init('assets/webnode/mina-rust/wasm_bg.wasm')).pipe(map(() => wasmFile))),
  //       // switchMap((wasm: any) => {
  //       //   return from(fetch('assets/webnode/block_verifier_index.bin'))
  //       //     .pipe(map((response: Response) => ({ wasm, blockVerifierIndex: response })));
  //       // }),
  //       // switchMap(({ wasm, blockVerifierIndex }) => {
  //       //   return from(blockVerifierIndex.arrayBuffer())
  //       //     .pipe(map((buf: ArrayBuffer) => ({ wasm, blockVerifierIndexBuffer: new Uint8Array(buf) })));
  //       // }),
  //       // switchMap(({ wasm, blockVerifierIndexBuffer }) => {
  //       //   return from(fetch('assets/webnode/block_verifier_srs.bin'))
  //       //     .pipe(map((response: Response) => ({ wasm, blockVerifierIndexBuffer, blockVerifierSrs: response })));
  //       // }),
  //       // switchMap(({ wasm, blockVerifierIndexBuffer, blockVerifierSrs }) => {
  //       //   return from(blockVerifierSrs.arrayBuffer())
  //       //     .pipe(map((buf: ArrayBuffer) => ({ wasm, blockVerifierIndexBuffer, blockVerifierSrsBuffer: new Uint8Array(buf) })));
  //       // }),
  //       map((wasm) => {
  //
  //         const fetchBytes = (url: string) => fetch(url)
  //           .then((resp: Response) => resp.arrayBuffer())
  //           .then((buf: ArrayBuffer) => new Uint8Array(buf));
  //         const block_verifier_index = fetchBytes('assets/webnode/block_verifier_index.bin');
  //         const block_verifier_srs = fetchBytes('assets/webnode/block_verifier_srs.bin');
  //
  //         const config = new (wasm.WasmConfig)();
  //         config.set_block_verifier_index(block_verifier_index);
  //         config.set_block_verifier_srs(block_verifier_srs);
  //         return { wasm, config };
  //       }),
  //       switchMap(({ wasm, config }: { wasm: any, config: WasmConfig }) => from(wasm.start(config))),
  //       tap((jsHandle: any) => {
  //         this.backend = jsHandle;
  //         this.backendSubject$.next(jsHandle as JsHandle);
  //       }),
  //       tap((r) => console.log(r)),
  //       tap(() => this.wasmLoadDestroy$.next(void 0))
  //     );
  // }

  get webNodeReady$(): Observable<JsHandle> {
    return this.backendSubject$.pipe(filter(Boolean));
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
      map((logs: any[]) => {
        // logs[0].kind = 'PeerReconnect';
        return WebNodeService.getWebNodeLog(logs)
      }),
    );
  }

  get fullLogs$(): Observable<any[]> {
    return this.backendSubject$.asObservable().pipe(
      filter(Boolean),
      switchMap(handle => from(handle.logs_range())),
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

  addWallet(publicKey: string): Observable<boolean> {
    return this.backendSubject$.asObservable().pipe(
      filter(Boolean),
      switchMap(handle => from(handle.watched_accounts().add(publicKey))),
    );
  }

  getWallet(publicKey: string): Observable<boolean> {
    return this.backendSubject$.asObservable().pipe(
      filter(Boolean),
      switchMap(handle => from(handle.watched_accounts().get(publicKey))),
    );
  }

  getBestTipSummary(): Observable<{ hash: string, level: number, timestamp: number }> {
    return this.backendSubject$.asObservable().pipe(
      filter(Boolean),
      switchMap(handle => from(handle.best_tip_summary())),
    );
  }

  createTransaction(transaction: WebNodeTransaction ): Observable<string> {
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

  isValidAddress(address: string): string | null {
    try {
      this.backend.is_account_pk_valid(address);
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
