/* tslint:disable */
/* eslint-disable */
/**
* @param {WasmConfig} config
* @returns {Promise<JsHandle>}
*/
export function start(config: WasmConfig): Promise<JsHandle>;
/**
* Entry point for web workers
* @param {number} ptr
*/
export function wasm_thread_entry_point(ptr: number): void;
/**
*/
export enum LogLevel {
  Trace,
  Debug,
  Info,
  Warn,
  Error,
}
/**
*/
export class Crypto {
  free(): void;
/**
* @returns {Uint8Array}
*/
  pub_key_as_protobuf(): Uint8Array;
/**
* @returns {string}
*/
  peer_id_as_b58(): string;
/**
* @param {Uint8Array} msg
* @returns {Uint8Array}
*/
  sign(msg: Uint8Array): Uint8Array;
/**
* @param {Uint8Array} pub_key_as_protobuf
* @returns {string}
*/
  pub_key_as_protobuf_to_peer_id_as_b58(pub_key_as_protobuf: Uint8Array): string;
/**
* @param {Uint8Array} pub_key_as_protobuf
* @param {Uint8Array} msg
* @param {Uint8Array} sig
*/
  assert_signature(pub_key_as_protobuf: Uint8Array, msg: Uint8Array, sig: Uint8Array): void;
/**
* @param {Uint8Array} pub_key_as_protobuf
* @param {string} expected_peer_id
*/
  pub_key_as_protobuf_to_peer_id(pub_key_as_protobuf: Uint8Array, expected_peer_id: string): void;
}
/**
*/
export class InMemLog {
  free(): void;
/**
* @param {string} key
* @returns {string | undefined}
*/
  get(key: string): string | undefined;
/**
* @returns {number}
*/
  id(): number;
/**
* @returns {number}
*/
  level(): number;
/**
* @returns {string}
*/
  as_json(): string;
}
/**
*/
export class JsHandle {
  free(): void;
/**
* @param {number | undefined} cursor
* @param {number | undefined} limit
* @returns {Promise<any>}
*/
  logs_range(cursor?: number, limit?: number): Promise<any>;
/**
* @returns {ManualConnector}
*/
  manual_connector(): ManualConnector;
/**
* @param {string} id
*/
  is_peer_id_valid(id: string): void;
/**
* @param {string} pk
*/
  is_account_pk_valid(pk: string): void;
/**
* @returns {Promise<any>}
*/
  global_state_get(): Promise<any>;
/**
* @returns {Promise<any>}
*/
  action_stats_since_start_get(): Promise<any>;
/**
* @returns {Promise<any>}
*/
  best_tip_summary(): Promise<any>;
/**
* @param {string} addr
* @returns {Promise<string>}
*/
  peer_connect(addr: string): Promise<string>;
/**
* @param {string} topic
* @param {any} msg
* @returns {Promise<void>}
*/
  pubsub_publish(topic: string, msg: any): Promise<void>;
/**
* @returns {any}
*/
  generate_account_keys(): any;
/**
* @param {any} data
* @returns {Promise<string>}
*/
  payment_sign_and_inject(data: any): Promise<string>;
/**
* @returns {WatchedAccounts}
*/
  watched_accounts(): WatchedAccounts;
}
/**
*/
export class ManualConnector {
  free(): void;
/**
* @param {string} peer_id
* @returns {Promise<Promise<any>>}
*/
  dial(peer_id: string): Promise<Promise<any>>;
/**
* @returns {any}
*/
  listen(): any;
}
/**
*/
export class WasmConfig {
  free(): void;
/**
*/
  constructor();
/**
* @param {Promise<any> | undefined} value
*/
  set_block_verifier_index(value?: Promise<any>): void;
/**
* @param {Promise<any> | undefined} value
*/
  set_block_verifier_srs(value?: Promise<any>): void;
}
/**
*/
export class WatchedAccounts {
  free(): void;
/**
* @param {string} pub_key
* @returns {Promise<boolean>}
*/
  add(pub_key: string): Promise<boolean>;
/**
* @param {string} pub_key
* @returns {Promise<any>}
*/
  get(pub_key: string): Promise<any>;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly __wbg_inmemlog_free: (a: number) => void;
  readonly inmemlog_get: (a: number, b: number, c: number, d: number) => void;
  readonly inmemlog_id: (a: number) => number;
  readonly inmemlog_level: (a: number) => number;
  readonly inmemlog_as_json: (a: number, b: number) => void;
  readonly __wbg_manualconnector_free: (a: number) => void;
  readonly manualconnector_dial: (a: number, b: number, c: number) => number;
  readonly manualconnector_listen: (a: number) => number;
  readonly __wbg_wasmconfig_free: (a: number) => void;
  readonly wasmconfig_new: () => number;
  readonly wasmconfig_set_block_verifier_index: (a: number, b: number) => void;
  readonly wasmconfig_set_block_verifier_srs: (a: number, b: number) => void;
  readonly start: (a: number) => number;
  readonly __wbg_jshandle_free: (a: number) => void;
  readonly jshandle_logs_range: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly jshandle_manual_connector: (a: number) => number;
  readonly jshandle_is_peer_id_valid: (a: number, b: number, c: number, d: number) => void;
  readonly jshandle_is_account_pk_valid: (a: number, b: number, c: number, d: number) => void;
  readonly jshandle_global_state_get: (a: number) => number;
  readonly jshandle_action_stats_since_start_get: (a: number) => number;
  readonly jshandle_best_tip_summary: (a: number) => number;
  readonly jshandle_peer_connect: (a: number, b: number, c: number) => number;
  readonly jshandle_pubsub_publish: (a: number, b: number, c: number, d: number) => number;
  readonly jshandle_generate_account_keys: (a: number) => number;
  readonly jshandle_payment_sign_and_inject: (a: number, b: number) => number;
  readonly jshandle_watched_accounts: (a: number) => number;
  readonly __wbg_watchedaccounts_free: (a: number) => void;
  readonly watchedaccounts_add: (a: number, b: number, c: number) => number;
  readonly watchedaccounts_get: (a: number, b: number, c: number) => number;
  readonly wasm_thread_entry_point: (a: number) => void;
  readonly __wbg_crypto_free: (a: number) => void;
  readonly crypto_pub_key_as_protobuf: (a: number, b: number) => void;
  readonly crypto_peer_id_as_b58: (a: number, b: number) => void;
  readonly crypto_sign: (a: number, b: number, c: number, d: number) => void;
  readonly crypto_pub_key_as_protobuf_to_peer_id_as_b58: (a: number, b: number, c: number, d: number) => void;
  readonly crypto_assert_signature: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly crypto_pub_key_as_protobuf_to_peer_id: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly memory: WebAssembly.Memory;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hf6095eaffb8acc8e: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h7e766a04a1afb3ee: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h49dccfef7a303cdb: (a: number, b: number) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h1ace8829c1af1eec: (a: number, b: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h16dafbe231267050: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_thread_destroy: () => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput, maybe_memory?: WebAssembly.Memory): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory): Promise<InitOutput>;
