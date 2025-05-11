import { Module } from '@nestjs/common';
import { ScrumPokerController } from './scrum.poker.controller';
import { RoomService } from './services/room.service';
import { CardService } from './services/card.service';
import { StoreModule } from '../store/store.module';
import { UserService } from './services/user.service';
import { ScrumPokerSocket } from './scrum.poker.socket';
import { VoteService } from './services/vote.service';
import { TaskService } from './services/task.service';
import { ScrumPokerService } from './scrum.poker.service';

@Module({
  imports: [StoreModule],
  providers: [
    RoomService,
    CardService,
    UserService,
    ScrumPokerSocket,
    VoteService,
    TaskService,
    ScrumPokerService,
  ],
  controllers: [ScrumPokerController],
})
export class ScrumPokerModule {}
