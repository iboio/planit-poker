import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './services/user.service';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class ScrumPokerSocket
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly userService: UserService) {}

  handleConnection(client: Socket) {
    const sessionId = client.handshake.auth.sessionId as string;
    client.join(sessionId);
  }

  handleDisconnect(client: Socket) {
    const sessionId = client.handshake.auth.sessionId as string;
    const userId = client.handshake.query.userId as string;
    const user = this.userService.findUser(sessionId, userId);
    if (!user) {
      return;
    }
    this.userService.deleteUserFromRoom(sessionId, user.username);
    this.eventHandler(sessionId, 'newUser', {
      allUsers: this.userService.allUserList(sessionId),
      activeUsers: this.userService.userActiveList(sessionId),
    });
    // const room = this.roomService.getRoom(sessionId);
    // if (room.voteStatus === 'VOTING') {
    //   this.voteService.deleteVote(sessionId, user.username);
    //   this.eventHandler(sessionId, 'new-vote', {
    //     votedUsers: this.voteService.getVotedUsers(sessionId),
    //   });
    // }
    client.leave(sessionId);
  }

  eventHandler(sessionId: string, event: string, data: any) {
    this.server.to(sessionId).emit(event, data);
  }
}
