// cron.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StoreService } from '../store/store.service';
import { RoomService } from './services/room.service';

@Injectable()
export class ScrumPokerService {
  constructor(
    private readonly roomService: RoomService,
    private readonly storeService: StoreService,
  ) {}

  private get room() {
    return this.storeService.getRoomStorage();
  }

  @Cron('0 0 * * *')
  handleMidnightJob() {
    const rooms = this.room;
    for (const sessionId in rooms) {
      const roomData = rooms[sessionId];
      if (roomData && roomData.length > 0) {
        this.roomService.deleteSession(sessionId);
      }
    }
  }
}
