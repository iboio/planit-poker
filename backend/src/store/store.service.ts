import { Injectable } from '@nestjs/common';
import { UsersStorage, VoteStorage } from '@dto/store';
import { Room } from '@dto/room';

@Injectable()
export class StoreService {
  private roomStorage: { [sessionId: string]: Room[] } = {};
  private voteStorage: { [sessionId: string]: VoteStorage[] } = {};
  private connectedUserPull: { [sessionId: string]: UsersStorage[] } = {};
  public getRoomStorage(): { [sessionId: string]: Room[] } {
    return this.roomStorage;
  }

  public getVoteStorage(): { [sessionId: string]: VoteStorage[] } {
    return this.voteStorage;
  }

  public getConnectedUserPull(): { [sessionId: string]: UsersStorage[] } {
    return this.connectedUserPull;
  }
}
