import { InitInput, InitOutput, InMemLog, JsHandle, LogLevel, ManualConnector, SyncInitInput, WasmConfig } from 'src/assets/webnode/mina-rust/wasm';

export interface WebNodeWasm {
  ManualConnector: ManualConnector;
  Crypto: Crypto;
  WasmConfig: WasmConfig;

  initSync(module: SyncInitInput, maybe_memory?: WebAssembly.Memory): InitOutput;

  SyncInitInput: ArrayBufferView | ArrayBuffer | WebAssembly.Module;
  InitInput: Request | string | URL | Response | ArrayBufferView | ArrayBuffer | WebAssembly.Module;

  start(): Promise<JsHandle>;

  JsHandle: JsHandle;
  InitOutput: InitOutput;
  InMemLog: InMemLog;
  LogLevel: LogLevel;

  wasm_thread_entry_point(ptr: number): void;

  readonly default: (module_or_path?: (InitInput | Promise<InitInput>), maybe_memory?: WebAssembly.Memory) => Promise<InitOutput>;
}
