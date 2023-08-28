import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'react-app',
  webDir: 'build',
  bundledWebRuntime: false,
  server:{
    url: '192.168.56.1:3000',
    cleartext: true
  }
};

export default config;
