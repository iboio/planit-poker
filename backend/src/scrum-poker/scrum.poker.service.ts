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

  @Cron('0 * * * *')
  handleHourlyCleanup() {
    const rooms = this.room;
    const now = new Date().getTime();

    for (const sessionId in rooms) {
      const roomData = rooms[sessionId][0];
      if (!roomData) continue;

      const createdAtTime = roomData.createdAt?.getTime?.() ?? 0;
      const lastActivityTime = roomData.updatedAt?.getTime?.() ?? 0;

      const hoursSinceCreation = (now - createdAtTime) / (1000 * 60 * 60);
      const hoursSinceLastActivity =
        (now - lastActivityTime) / (1000 * 60 * 60);

      if (hoursSinceCreation >= 24 || hoursSinceLastActivity >= 12) {
        this.roomService.deleteSession(sessionId);
      }
    }
  }
}
