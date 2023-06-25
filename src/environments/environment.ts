import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false,
  identifier: 'local',
  aggregator: 'http://1.k8.openmina.com:31308/aggregator',
  nodeLister: {
    domain: 'http://65.21.195.80',
    port: 4000,
  },
  isVanilla: true,
  globalConfig: {
    features: {
      dashboard: ['nodes', 'topology'],
      explorer: ['blocks', 'transactions', 'snark-pool', 'scan-state', 'snark-traces'],
      resources: ['system'],
      network: ['messages', 'connections', 'blocks', 'blocks-ipc'],
      tracing: ['overview', 'blocks'],
      benchmarks: ['wallets', 'transactions'],
      storage: ['accounts'],
      'snark-worker': ['dashboard', 'actions', 'frontier'],
      'web-node': ['wallet', 'peers', 'logs', 'state'],
    },
  },
  configs: [
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/node1",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/node1/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/node1/bpf-debugger",
    //   "name": "node1"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/node2",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/node2/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/node2/bpf-debugger",
    //   "name": "node2"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/node3",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/node3/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/node3/bpf-debugger",
    //   "name": "node3"
    // },
    {
      "graphql": "http://1.k8.openmina.com:31308/node4",
      "tracing-graphql": "http://1.k8.openmina.com:31308/node4/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/node4/bpf-debugger",
      "name": "node4"
    },
    {
      "graphql": "http://1.k8.openmina.com:31308/node5",
      "tracing-graphql": "http://1.k8.openmina.com:31308/node5/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/node5/bpf-debugger",
      "name": "node5"
    },
    {
      "graphql": "http://1.k8.openmina.com:31308/node6",
      "tracing-graphql": "http://1.k8.openmina.com:31308/node6/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/node6/bpf-debugger",
      "name": "node6"
    },
    {
      "graphql": "http://1.k8.openmina.com:31308/node7",
      "tracing-graphql": "http://1.k8.openmina.com:31308/node7/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/node7/bpf-debugger",
      "name": "node7"
    },
    {
      "graphql": "http://1.k8.openmina.com:31308/node8",
      "tracing-graphql": "http://1.k8.openmina.com:31308/node8/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/node8/bpf-debugger",
      "name": "node8"
    },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/prod01",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/prod01/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/prod01/bpf-debugger",
    //   "name": "prod01"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/prod02",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/prod02/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/prod02/bpf-debugger",
    //   "name": "prod02"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/prod03",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/prod03/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/prod03/bpf-debugger",
    //   "name": "prod03"
    // },
    {
      "graphql": "http://1.k8.openmina.com:31308/prod2",
      "tracing-graphql": "http://1.k8.openmina.com:31308/prod2/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/prod2/bpf-debugger",
      "name": "prod2"
    },
    {
      "graphql": "http://1.k8.openmina.com:31308/prod3",
      "tracing-graphql": "http://1.k8.openmina.com:31308/prod3/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/prod3/bpf-debugger",
      "name": "prod3"
    },
    {
      "graphql": "http://1.k8.openmina.com:31308/seed1",
      "tracing-graphql": "http://1.k8.openmina.com:31308/seed1/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/seed1/bpf-debugger",
      "name": "seed1"
    },
    {
      "graphql": "http://1.k8.openmina.com:31308/seed2",
      "tracing-graphql": "http://1.k8.openmina.com:31308/seed2/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/seed2/bpf-debugger",
      "name": "seed2"
    },
    {
      "graphql": "http://1.k8.openmina.com:31308/snarker001",
      "tracing-graphql": "http://1.k8.openmina.com:31308/snarker001/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/snarker001/bpf-debugger",
      "name": "snarker001"
    },
    {
      "graphql": "http://1.k8.openmina.com:31308/snarker002",
      "tracing-graphql": "http://1.k8.openmina.com:31308/snarker002/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/snarker002/bpf-debugger",
      "name": "snarker002"
    },
    {
      "graphql": "http://1.k8.openmina.com:31308/snarker003",
      "tracing-graphql": "http://1.k8.openmina.com:31308/snarker003/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/snarker003/bpf-debugger",
      "name": "snarker003"
    },
    {
      "graphql": "http://1.k8.openmina.com:31308/snarker004",
      "tracing-graphql": "http://1.k8.openmina.com:31308/snarker004/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/snarker004/bpf-debugger",
      "name": "snarker004"
    },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker005",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker005/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker005/bpf-debugger",
    //   "name": "snarker005"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker006",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker006/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker006/bpf-debugger",
    //   "name": "snarker006"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker007",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker007/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker007/bpf-debugger",
    //   "name": "snarker007"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker008",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker008/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker008/bpf-debugger",
    //   "name": "snarker008"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker009",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker009/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker009/bpf-debugger",
    //   "name": "snarker009"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker010",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker010/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker010/bpf-debugger",
    //   "name": "snarker010"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker011",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker011/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker011/bpf-debugger",
    //   "name": "snarker011"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker012",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker012/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker012/bpf-debugger",
    //   "name": "snarker012"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker013",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker013/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker013/bpf-debugger",
    //   "name": "snarker013"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker014",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker014/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker014/bpf-debugger",
    //   "name": "snarker014"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker015",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker015/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker015/bpf-debugger",
    //   "name": "snarker015"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker016",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker016/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker016/bpf-debugger",
    //   "name": "snarker016"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker017",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker017/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker017/bpf-debugger",
    //   "name": "snarker017"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker018",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker018/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker018/bpf-debugger",
    //   "name": "snarker018"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker019",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker019/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker019/bpf-debugger",
    //   "name": "snarker019"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker020",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker020/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker020/bpf-debugger",
    //   "name": "snarker020"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker021",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker021/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker021/bpf-debugger",
    //   "name": "snarker021"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker022",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker022/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker022/bpf-debugger",
    //   "name": "snarker022"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker023",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker023/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker023/bpf-debugger",
    //   "name": "snarker023"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker024",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker024/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker024/bpf-debugger",
    //   "name": "snarker024"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker025",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker025/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker025/bpf-debugger",
    //   "name": "snarker025"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker026",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker026/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker026/bpf-debugger",
    //   "name": "snarker026"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker027",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker027/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker027/bpf-debugger",
    //   "name": "snarker027"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker028",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker028/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker028/bpf-debugger",
    //   "name": "snarker028"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker029",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker029/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker029/bpf-debugger",
    //   "name": "snarker029"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker030",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker030/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker030/bpf-debugger",
    //   "name": "snarker030"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker031",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker031/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker031/bpf-debugger",
    //   "name": "snarker031"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker032",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker032/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker032/bpf-debugger",
    //   "name": "snarker032"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker033",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker033/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker033/bpf-debugger",
    //   "name": "snarker033"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker034",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker034/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker034/bpf-debugger",
    //   "name": "snarker034"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker035",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker035/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker035/bpf-debugger",
    //   "name": "snarker035"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker036",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker036/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker036/bpf-debugger",
    //   "name": "snarker036"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker037",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker037/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker037/bpf-debugger",
    //   "name": "snarker037"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker038",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker038/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker038/bpf-debugger",
    //   "name": "snarker038"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker039",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker039/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker039/bpf-debugger",
    //   "name": "snarker039"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker040",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker040/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker040/bpf-debugger",
    //   "name": "snarker040"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker041",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker041/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker041/bpf-debugger",
    //   "name": "snarker041"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker042",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker042/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker042/bpf-debugger",
    //   "name": "snarker042"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker043",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker043/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker043/bpf-debugger",
    //   "name": "snarker043"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker044",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker044/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker044/bpf-debugger",
    //   "name": "snarker044"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker045",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker045/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker045/bpf-debugger",
    //   "name": "snarker045"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker046",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker046/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker046/bpf-debugger",
    //   "name": "snarker046"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker047",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker047/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker047/bpf-debugger",
    //   "name": "snarker047"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker048",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker048/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker048/bpf-debugger",
    //   "name": "snarker048"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker049",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker049/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker049/bpf-debugger",
    //   "name": "snarker049"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker050",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker050/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker050/bpf-debugger",
    //   "name": "snarker050"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker051",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker051/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker051/bpf-debugger",
    //   "name": "snarker051"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker052",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker052/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker052/bpf-debugger",
    //   "name": "snarker052"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker053",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker053/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker053/bpf-debugger",
    //   "name": "snarker053"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker054",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker054/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker054/bpf-debugger",
    //   "name": "snarker054"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker055",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker055/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker055/bpf-debugger",
    //   "name": "snarker055"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker056",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker056/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker056/bpf-debugger",
    //   "name": "snarker056"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker057",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker057/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker057/bpf-debugger",
    //   "name": "snarker057"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker058",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker058/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker058/bpf-debugger",
    //   "name": "snarker058"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker059",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker059/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker059/bpf-debugger",
    //   "name": "snarker059"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker060",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker060/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker060/bpf-debugger",
    //   "name": "snarker060"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker061",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker061/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker061/bpf-debugger",
    //   "name": "snarker061"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker062",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker062/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker062/bpf-debugger",
    //   "name": "snarker062"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker063",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker063/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker063/bpf-debugger",
    //   "name": "snarker063"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker064",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker064/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker064/bpf-debugger",
    //   "name": "snarker064"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker065",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker065/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker065/bpf-debugger",
    //   "name": "snarker065"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker066",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker066/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker066/bpf-debugger",
    //   "name": "snarker066"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker067",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker067/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker067/bpf-debugger",
    //   "name": "snarker067"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker068",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker068/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker068/bpf-debugger",
    //   "name": "snarker068"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker069",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker069/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker069/bpf-debugger",
    //   "name": "snarker069"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker070",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker070/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker070/bpf-debugger",
    //   "name": "snarker070"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker071",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker071/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker071/bpf-debugger",
    //   "name": "snarker071"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker072",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker072/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker072/bpf-debugger",
    //   "name": "snarker072"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker073",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker073/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker073/bpf-debugger",
    //   "name": "snarker073"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker074",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker074/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker074/bpf-debugger",
    //   "name": "snarker074"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker075",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker075/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker075/bpf-debugger",
    //   "name": "snarker075"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker076",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker076/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker076/bpf-debugger",
    //   "name": "snarker076"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker077",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker077/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker077/bpf-debugger",
    //   "name": "snarker077"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker078",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker078/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker078/bpf-debugger",
    //   "name": "snarker078"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker079",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker079/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker079/bpf-debugger",
    //   "name": "snarker079"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker080",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker080/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker080/bpf-debugger",
    //   "name": "snarker080"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker081",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker081/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker081/bpf-debugger",
    //   "name": "snarker081"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker082",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker082/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker082/bpf-debugger",
    //   "name": "snarker082"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker083",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker083/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker083/bpf-debugger",
    //   "name": "snarker083"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker084",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker084/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker084/bpf-debugger",
    //   "name": "snarker084"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker085",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker085/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker085/bpf-debugger",
    //   "name": "snarker085"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker086",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker086/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker086/bpf-debugger",
    //   "name": "snarker086"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker087",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker087/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker087/bpf-debugger",
    //   "name": "snarker087"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker088",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker088/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker088/bpf-debugger",
    //   "name": "snarker088"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker089",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker089/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker089/bpf-debugger",
    //   "name": "snarker089"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker090",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker090/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker090/bpf-debugger",
    //   "name": "snarker090"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker091",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker091/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker091/bpf-debugger",
    //   "name": "snarker091"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker092",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker092/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker092/bpf-debugger",
    //   "name": "snarker092"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker093",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker093/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker093/bpf-debugger",
    //   "name": "snarker093"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker094",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker094/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker094/bpf-debugger",
    //   "name": "snarker094"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker095",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker095/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker095/bpf-debugger",
    //   "name": "snarker095"
    // },
    // {
    //   "graphql": "http://1.k8.openmina.com:31308/snarker096",
    //   "tracing-graphql": "http://1.k8.openmina.com:31308/snarker096/internal-trace",
    //   "debugger": "http://1.k8.openmina.com:31308/snarker096/bpf-debugger",
    //   "name": "snarker096"
    // }
  ],
};

