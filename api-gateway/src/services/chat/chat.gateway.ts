import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';


@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('Hello')
  hello() {
    this.logger.log('Hello Men');
  }

  afterInit(server: Server): any {
    this.logger.log('Server Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('Un cliente se conecto', client.id)
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Un cliente se desconecto', client.id)
  }
}