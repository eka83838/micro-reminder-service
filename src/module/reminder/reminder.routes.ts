import * as Hapi from 'hapi';
import { IServerConfigurations } from '../../configurations';
import ReminderController from './reminder.controller';
import * as Joi from 'joi';

export default function (server: Hapi.Server, serverConfigs: IServerConfigurations) {
  const reminderController = new ReminderController();
  // server.route({
  //   method: 'GET',
  //   path: '/reminder-sms/before-duedate',
  //   config: {
  //     handler: reminderController.beforeDueDate,
  //     validate: {
  //       query: {
  //         cycle : Joi.string().required(),
  //         asofdate: Joi.date().optional()
  //       }
  //     }
  //   }
  // });
  // server.route({
  //   method: 'GET',
  //   path: '/reminder-sms/after-duedate',
  //   config: {
  //     handler: reminderController.afterDueDate,
  //     validate: {
  //       query: {
  //         cycle : Joi.string().required(),
  //         asofdate: Joi.date().optional()
  //       }
  //     }
  //   }
  // });
  server.route({
    method: 'GET',
    path: '/reminder-sms',
    config: {
      handler: reminderController.sendSMSReminder,
      validate: {
        query: {
          asofdate: Joi.date().optional()
        }
      }
    }
  });
}
