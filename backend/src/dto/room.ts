export class User {
  username: string;
  sessionId: string;
  userId: string;
}

export class Register extends User {
  role: string;
}

export class Card {
  key: string;
  value: string;
}

export class Vote {
  sessionId: string;
  userId: string;
  role: string;
  username: string;
  card: Card;
}

export class Room {
  roomRule: string;
  roomName: string;
  showTask: boolean;
  tasks: Task[];
  show: boolean;
  cards: Card[];
  activeUsers: RoomUser[];
  allUsers: RoomUser[];
  voteStatus: string;
}

class RoomUser {
  username: string;
  role: string;
}

export class Task {
  task: string;
  taskStatus: string;
}

export class nextTask extends User {
  type: string;
  votingTask: Task;
}
