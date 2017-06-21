import * as Hapi from 'hapi';
import { IServerConfigurations } from '../configurations';


export interface IPluginOptions {
    serverConfigs: IServerConfigurations;
}

export interface IPlugin {
    register(server: Hapi.Server, options?: IPluginOptions);
    info(): IPluginInfo;
}

export interface IPluginInfo {
    name: string;
    version: string;
}
