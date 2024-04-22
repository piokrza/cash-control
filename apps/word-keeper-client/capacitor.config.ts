import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'word-keeper-client',
  webDir: '../../dist/apps/word-keeper-client',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
