import { Injectable } from '@nestjs/common';
import { StoreService } from '@store/store.service';
import { Message } from '@dto/room';

@Injectable()
export class MessageService {
  constructor(private readonly storeService: StoreService) {}

  private get rooms() {
    return this.storeService.getRoomStorage();
  }

  setMessageInStore(message: Message) {
    const sessionId = message.sessionId;
    if (!this.rooms[sessionId]) {
      this.rooms[sessionId] = [];
    }
    this.rooms[sessionId][0].messages.push(message);
  }
}
