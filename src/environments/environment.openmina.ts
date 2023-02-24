import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  sentry: {
    dsn: 'https://b3f84009064b4f0fa4aaed51437e1b8e@o4504536952733696.ingest.sentry.io/4504537179684864',
    tracingOrigins: ['https://www.openmina.com'],
  },
  configs: [
    {
      backend: 'https://webrtc.webnode.openmina.com',
      features: ['web-node-demo'],
      name: 'Web Node Demo',
    },
  ],
  firebase: {
    apiKey: 'AIzaSyBmm15H4IfHUdDock4SN8qj-kmA_J6ukpc',
    authDomain: 'openmina-9c3e6.firebaseapp.com',
    projectId: 'openmina-9c3e6',
    storageBucket: 'openmina-9c3e6.appspot.com',
    messagingSenderId: '787301189441',
    appId: '1:787301189441:web:9b4f370cc72b77d949c3c0',
    measurementId: 'G-5W9KKPFNN5',
  },
};
