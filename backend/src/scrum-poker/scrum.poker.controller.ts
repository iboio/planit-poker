import { Body, Controller, Get, Param, Post, Headers } from '@nestjs/common';
import { RoomService } from './services/room.service';
import { UserService } from './services/user.service';
import { CreateRoomRequest, EditUser } from '@dto/request';
import { ScrumPokerSocket } from './scrum.poker.socket';
import { VoteService } from './services/vote.service';
import { Message, nextTask, Register, User, Vote } from '@dto/room';
import { TaskService } from './services/task.service';
import { MessageService } from '@roomService/message.service';

@Controller()
export class ScrumPokerController {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly voteService: VoteService,
    private readonly scrumPokerGateway: ScrumPokerSocket,
    private readonly taskService: TaskService,
    private readonly messageService: MessageService,
  ) {}

  @Post('createRoom')
  createRoom(@Body() createRoom: CreateRoomRequest) {
    const { sessionId, key } = this.roomService.createRoom(createRoom);
    return { sessionId: `${sessionId}`, key: key };
  }

  //
  @Post('check')
  securityCheck(@Body() user: Register) {
    const { sessionId } = user;
    if (!this.roomService.roomExist(sessionId)) {
      return { status: 'ROOM_NOT_FOUND' };
    }
    if (this.userService.userExist(user)) {
      this.userService.addUserToRoom(user);
      this.scrumPokerGateway.eventHandler(sessionId, 'newUser', {
        allUsers: this.userService.allUserList(sessionId),
        activeUsers: this.userService.userActiveList(sessionId),
      });
      return { status: 'RECONNECTED' };
    }
    return { status: 'NEW_USER' };
  }

  @Post('registerRoom')
  setUsername(@Body() user: Register) {
    if (!this.userService.usernameExist(user)) {
      return { status: 'USERNAME_EXIST' };
    }
    const { sessionId } = user;
    this.userService.addUser(user);
    const systemMsg = {
      sessionId: sessionId,
      userId: 'system',
      username: 'System',
      role: 'system',
      type: 'system',
      message: `${user.username} joined the room with ${user.role} role`,
      timestamp: new Date(),
    } as Message;
    this.messageService.setMessageInStore(systemMsg);
    this.scrumPokerGateway.eventHandler(sessionId, 'newMessage', {
      message: {
        ...systemMsg,
      },
    });
    this.scrumPokerGateway.eventHandler(sessionId, 'newUser', {
      allUsers: this.userService.allUserList(sessionId),
      activeUsers: this.userService.userActiveList(sessionId),
    });
    return { status: 'USERNAME_OK' };
  }

  @Get('room/:sessionId')
  getRoomData(@Param('sessionId') sessionId: string) {
    const roomData = this.roomService.getRoom(sessionId);
    return {
      room: roomData,
      votes: roomData.show ? this.voteService.getVotes(sessionId) : [],
      votedUsers: this.voteService.getVotedUsers(sessionId),
    };
  }

  //
  @Post('room/vote')
  votes(@Body() vote: Vote) {
    const { sessionId } = vote;
    this.voteService.addVote(vote);

    this.scrumPokerGateway.eventHandler(sessionId, 'newVote', {
      votedUsers: this.voteService.getVotedUsers(sessionId),
    });
    this.roomService.updateRoom(sessionId);
    return { message: 'Vote recorded' };
  }

  @Post('room/showVotes')
  showVotes(@Body() user: User) {
    const { sessionId } = user;
    const room = this.roomService.getRoom(sessionId);
    room.show = true;
    room.voteStatus = 'SHOW_VOTES';

    this.scrumPokerGateway.eventHandler(sessionId, 'showVotes', {
      votes: this.voteService.getVotes(sessionId),
    });
    this.roomService.updateRoom(sessionId);
    return { message: 'Votes shown' };
  }

  @Post('room/nextTask')
  newTask(@Body() task: nextTask) {
    const { sessionId, type } = task;
    if (type == 'nextTask') {
      this.taskService.nextTask(task);
    }
    const room = this.roomService.getRoom(sessionId);
    room.show = false;
    room.voteStatus = 'VOTING';
    this.voteService.resetVoteRoom(sessionId);
    this.scrumPokerGateway.eventHandler(sessionId, 'nextTask', {
      tasks: this.taskService.getTaskList(sessionId),
    });
    this.roomService.updateRoom(sessionId);
    return { message: 'next task' };
  }

  @Post('room/editUser')
  changeUsername(@Body() user: EditUser) {
    const { sessionId } = user;
    if (!this.userService.editUser(user)) {
      return { status: 'USERNAME_EXIST' };
    }
    this.scrumPokerGateway.eventHandler(sessionId, 'newUser', {
      allUsers: this.userService.allUserList(sessionId),
      activeUsers: this.userService.userActiveList(sessionId),
    });
    this.scrumPokerGateway.eventHandler(sessionId, 'newVote', {
      votedUsers: this.voteService.getVotedUsers(sessionId),
    });
    const room = this.roomService.getRoom(sessionId);
    if (room.show) {
      this.scrumPokerGateway.eventHandler(sessionId, 'showVotes', {
        votes: this.voteService.getVotes(sessionId),
      });
    }
  }

  @Get('/ga')
  getGA() {
    return { GA_ID: process.env.GA_ID };
  }

  @Post('room/message')
  handleMessage(@Body() message: Message) {
    const { sessionId } = message;
    if (!this.roomService.roomExist(sessionId)) {
      return { status: 'ROOM_NOT_FOUND' };
    }
    this.messageService.setMessageInStore(message);
    this.scrumPokerGateway.eventHandler(sessionId, 'newMessage', {
      message: {
        ...message,
      },
    });
    return { status: 'MESSAGE_SENT' };
  }
}
