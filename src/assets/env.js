(function (window) {
  window['env'] = {
    production: true,
    nodes: [
      {
        backend: 'https://debug.dev.openmina.com:3086',
        debugger: 'https://debug.dev.openmina.com',
        minaExplorer: 'https://berkeley.api.minaexplorer.com',
        features: ['network', 'stressing'],
        name: 'debug',
      },
    ],
  };
})(this);
