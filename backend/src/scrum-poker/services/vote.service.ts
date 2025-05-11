import { Injectable } from '@nestjs/common';
import { StoreService } from '@store/store.service';
import { Vote } from '@dto/room';

@Injectable()
export class VoteService {
  constructor(private readonly storeService: StoreService) {}

  private get votes() {
    return this.storeService.getVoteStorage();
  }

  getVotes(sessionId: string) {
    return this.votes[sessionId];
  }

  createVoteStorage(sessionId: string) {
    if (!this.votes[sessionId]) {
      this.votes[sessionId] = [];
    }
  }

  addVote(vote: Vote) {
    const { sessionId, username, card, role } = vote;
    const existingVote = this.votes[sessionId].find(
      (vote) => vote.username === username,
    );
    if (existingVote) {
      existingVote.card.value = card.value;
    } else {
      this.votes[sessionId].push({ username, card: card, role: role });
    }
  }

  getVotedUsers(sessionId: string) {
    return this.votes[sessionId].map((vote) => vote.username);
  }

  resetVoteRoom(sessionId: string) {
    if (this.votes[sessionId]) {
      this.votes[sessionId] = [];
    }
  }
}
