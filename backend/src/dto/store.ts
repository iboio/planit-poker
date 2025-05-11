import { Card } from './room';

export class UsersStorage {
  userId: string;
  username: string;
  role: string;
}
export class VoteStorage {
  username: string;
  card: Card;
  role: string;
}
