import * as Server from './server';
import * as Configs from './configurations';

//Starting Application Server
const serverConfigs = Configs.getServerConfigs();
const server = Server.init(serverConfigs);

server.start(() => {
  console.log('Server running at:' + server.info.uri);
});
