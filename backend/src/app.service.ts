import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RoomService } from './scrum-poker/services/room.service';
import { StoreService } from './store/store.service';

@Injectable()
export class AppService {}
