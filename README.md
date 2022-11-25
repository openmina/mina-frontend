# MinaFrontend

This project was generated with Angular CLI version 14.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Web node integration process

1. Get the latest version of the node.
2. Go to wasm directory (the one which contains Cargo.toml: `openmina/node/wasm`)
3. Run `eval 'ssh-agent -s'`
4. Run `ssh-add`
5. Run `cargo update`
6. Run `wasm-pack build --target web`
7. Copy content of **pkg** directory (in Windows run `explorer.exe .` and copy as usual)
8. Paste content in **mina-frontend/assets/webnode/mina-rust**
9. In **wasm.d.ts** add Typescript lines from alteration.txt
10. In **wasm.js** add Javascript lines from alteration.txt
