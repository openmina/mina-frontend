## Web node integration steps
The integration of the web node is done by using the **wasm-pack** tool. The tool is used to compile the Rust code to WebAssembly and to generate the Javascript and Typescript bindings. The bindings are used to communicate with the Rust code from the Typescript code. The integration process is done by following these steps:

```bash
1. Get the latest version of the node.
2. Navigate to wasm directory (the one which contains Cargo.toml: `openmina/node/wasm`)
3. Run `eval 'ssh-agent -s'`
4. Run `ssh-add`
5. Run `cargo update` or `cargo update -p mina-p2p-messages`
6. Run `wasm-pack build --target web` or `rustup run nightly wasm-pack build --target web`
7. Copy the content of **pkg** directory (in Windows run `explorer.exe .` and copy)
8. Paste the content inside **mina-frontend/assets/webnode/mina-rust**
9. In **wasm.d.ts** add Typescript lines from alteration.txt
10. In **wasm.js** add Javascript lines from alteration.txt
```
