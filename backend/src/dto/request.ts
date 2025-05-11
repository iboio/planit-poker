import { User } from './room';

export class CreateRoomRequest {
  roomRule: string;
  roomName: string;
  tasks: string[];
  incAmount: string;
  showTask: boolean;
}

export class EditUser extends User {
  newRole: string;
  newUsername: string;
}
