import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { StoreService } from '@store/store.service';
import { CreateRoomRequest } from '@dto/request';
import { Room } from '@dto/room';
import { CardService } from './card.service';
import { VoteService } from './vote.service';
import * as crypto from 'crypto';
import { TaskService } from './task.service';
import { UserService } from './user.service';
@Injectable()
export class RoomService {
  constructor(
    private readonly storeService: StoreService,
    private readonly cardService: CardService,
    private readonly voteService: VoteService,
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  private get users() {
    return this.storeService.getConnectedUserPull();
  }

  private get rooms() {
    return this.storeService.getRoomStorage();
  }

  private get votes() {
    return this.storeService.getVoteStorage();
  }

  setRoomInStore(sessionId: string) {
    if (!this.rooms[sessionId]) {
      this.rooms[sessionId] = [];
    }
  }

  createRoom(data: CreateRoomRequest) {
    const { roomRule, roomName, incAmount, tasks, showTask } = data;
    const sessionId = crypto.randomUUID();
    const key = crypto.randomUUID();
    if (!roomRule || !roomName) {
      throw new BadRequestException(
        'Missing required fields: roomRule, roomName',
      );
    }

    try {
      this.setRoomInStore(sessionId);
      const roomData = {
        cards: this.cardService.cardGenerate(roomRule, incAmount),
        roomName: roomName,
        roomRule: roomRule,
        showTask: showTask,
        show: false,
        tasks: this.taskService.createTasks(tasks),
        activeUsers: [],
        allUsers: [],
        voteStatus: 'VOTING',
      } as Room;

      this.rooms[sessionId].push(roomData);
      this.voteService.createVoteStorage(sessionId);
      this.userService.createUserStorage(sessionId);
      return { sessionId, key };
    } catch (error) {
      console.error('createRoom sırasında hata oluştu:', error);
      throw new InternalServerErrorException(
        'Oda oluşturulurken bir hata meydana geldi.',
      );
    }
  }
  getRoom(sessionId: string) {
    return this.rooms[sessionId]?.[0];
  }

  roomExist(sessionId: string) {
    return !!this.rooms[sessionId];
  }

  deleteSession(sessionId: string) {
    if (this.rooms[sessionId]) {
      delete this.rooms[sessionId];
    }

    if (this.votes[sessionId]) {
      delete this.votes[sessionId];
    }

    if (this.users[sessionId]) {
      delete this.users[sessionId];
    }
  }
}
