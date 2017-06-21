import * as Hapi from 'hapi';
import { IServerConfigurations } from './configurations';
import { IPlugin } from './plugins/interfaces';
import { registerRoutes } from './module';

export function init (configs: IServerConfigurations) {
  const port = process.env.port || configs.port;
  const host = process.env.host || configs.host;
  const server = new Hapi.Server();

  server.connection({
    port: port,
    host: host,
    routes: {
      cors: true
    }
  });

  const plugins: Array<string> = configs.plugins || [];
  const pluginOptions = {
    serverConfigs: configs
  };
  if (plugins.length > 0) {
    plugins.forEach((pluginName: string) => {
      var plugin: IPlugin = (require('./plugins/' + pluginName)).default();
      console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
      plugin.register(server, pluginOptions);
    });
  } else {
    console.log('Server running without any plugin registered');
  }

  registerRoutes(server, configs);

  return server;
}
