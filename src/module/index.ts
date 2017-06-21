import * as Hapi from 'hapi';
import * as glob from 'glob';
import { IServerConfigurations } from '../configurations';

export function registerRoutes(server: Hapi.Server, configs: IServerConfigurations) {
  var allRoutes = glob.sync('**/*.routes.js', { absolute: true });
  allRoutes.forEach((route) => {
    let routes = require(route);
    routes.default(server, configs);
  });
}
