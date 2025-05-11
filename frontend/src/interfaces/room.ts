export interface CreateRoomRequest {
  roomRule: string;
  roomName: string;
  tasks: string[] | [];
  incAmount: string;
  showTask: boolean;
}

export interface CreateRoomResponse {
  sessionId: string;
  key: string;
}

export interface User {
  username: string;
  sessionId: string;
  userId: string;
  key: string;
}

export interface SecurityCheckResponse {
  message: 'Room not exist' | 'auth' | 'not auth';
}
export interface Room {
  roomRule: string;
  roomName: string;
  tasks: Task[];
  showTask: boolean;
  cards: Card[];
  show: boolean;
  activeUsers: RoomUser[];
  allUsers: RoomUser[];
  createdAt: Date;
  voteStatus: string;
}
export interface RoomData {
    userType: string;
    room: Room;
    votes: [] | Vote[];
    votedUsers: string[];

}

export interface RoomUser {
  username: string;
  role: string;
}

export interface VoteRequest {
  sessionId: string;
  userId: string;
  username: string;
  card: {
    key: string;
    value: string;
  };
}
export interface Card {
  key: string;
  value: string;
}

export interface Vote {
  username: string;
  card: Card;
  role: string;
}
export interface Task{
  task: string;
  taskStatus: string;
}
