(function (window) {
  window['env'] = {
    production: true,
    identifier: 'openmina',
    aggregator: 'http://1.k8.openmina.com:31308/aggregator',
    nodeLister: {
      domain: 'http://65.21.195.80',
      port: 4000,
    },
    isVanilla: true,
    globalConfig: {
      features: {
        dashboard: ['nodes'],
        // explorer: ['blocks', 'transactions', 'snark-pool', 'scan-state', 'snark-traces'],
        // resources: ['system'],
        // network: ['messages', 'connections', 'blocks', 'blocks-ipc'],
        tracing: ['overview', 'blocks'],
        // benchmarks: ['wallets', 'transactions'],
        // storage: ['accounts'],
        // 'snark-worker': ['dashboard', 'actions'],
        // 'web-node': ['wallet', 'peers', 'logs', 'state'],
      },
    },
    configs: [],
  }
})(this);
