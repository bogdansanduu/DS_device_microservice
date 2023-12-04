import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Notifications } from '../constants/notifications';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  sendNotification(
    deviceId: number,
    userId: number,
    notificationMessage: string,
  ) {
    this.server.emit(Notifications.CONSUMPTION_EXCEEDED, {
      message: notificationMessage,
      deviceId: deviceId,
      userId: userId,
    });
  }
}
