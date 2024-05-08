import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io"
import { Comment } from "src/comments/entities/comment.entity";

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class EventsGateway implements OnModuleInit{
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
    });
  }  

  @SubscribeMessage('newMessage')
  async onNewMessage(@MessageBody() comment: Comment[]) {
    this.server.emit('onMessage', comment);
  }
}  