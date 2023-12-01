import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.simplepdf.app',
  appName: 'simplepdfsign',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
