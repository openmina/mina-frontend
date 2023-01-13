(function (window) {
  window['env'] = {
    production: true,
    configs: [
      {
        backend: 'https://debug.dev.openmina.com:3086',
        debugger: 'https://debug.dev.openmina.com',
        minaExplorer: 'https://berkeley.api.minaexplorer.com',
        features: ['network', 'benchmarks'],
        name: 'debug',
      },
    ],
  };
})(this);
