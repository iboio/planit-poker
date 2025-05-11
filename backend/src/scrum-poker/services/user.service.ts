import { Injectable } from '@nestjs/common';
import { StoreService } from '@store/store.service';
import { Register, User } from '@dto/room';
import { VoteService } from './vote.service';
import { EditUser } from '@dto/request';

@Injectable()
export class UserService {
  constructor(
    private readonly storeService: StoreService,
    private readonly voteService: VoteService,
  ) {}

  private get users() {
    return this.storeService.getConnectedUserPull();
  }
  private get room() {
    return this.storeService.getRoomStorage();
  }

  createUserStorage(sessionId: string) {
    if (!this.users[sessionId]) {
      this.users[sessionId] = [];
    }
  }

  findUser(sessionId: string, userId: string) {
    const usersInRoom = this.users[sessionId];
    if (!usersInRoom) {
      return null;
    }

    const user = usersInRoom.find((user) => user.userId === userId);
    if (!user) {
      return null;
    }

    return user;
  }

  deleteUserFromRoom(sessionId: string, username: string) {
    const roomData = this.room[sessionId];
    if (!roomData) {
      return;
    }

    const room = roomData[0];
    const userIndex = room.activeUsers.findIndex(
      (user) => user.username === username,
    );
    if (userIndex !== -1) {
      room.activeUsers.splice(userIndex, 1);
    }
  }

  addUserToRoom(user: Register) {
    const { sessionId, username, role } = user;
    const roomData = this.room[sessionId];
    if (!roomData) {
      return;
    }

    const room = roomData[0];
    if (room.activeUsers.some((user) => user.username === username)) {
      return;
    }
    room.activeUsers.push({ username, role });

    if (room.allUsers.some((user) => user.username === username)) {
      return;
    }
    room.allUsers.push({ username, role });
  }

  userExist(data: User) {
    const { sessionId, userId } = data;
    const userStore = this.users[sessionId];
    if (!userStore) {
      return false;
    }
    return userStore.find((user) => user.userId === userId);
  }

  addUser(user: Register) {
    const { sessionId, username, userId, role } = user;
    if (!this.users[sessionId]) {
      this.users[sessionId] = [];
    }
    this.addUserToRoom(user);
    this.users[sessionId].push({ username, userId, role });
  }

  userActiveList(sessionId: string) {
    const roomData = this.room[sessionId];
    if (!roomData) {
      return [];
    }
    return roomData[0].activeUsers;
  }

  allUserList(sessionId: string) {
    const userStore = this.users[sessionId];
    if (!userStore) {
      return [];
    }
    return userStore.map((user) => ({
      username: user.username,
      role: user.role,
    }));
  }

  usernameExist(data: User) {
    const { sessionId, username } = data;
    const user = this.users[sessionId].find(
      (user) => user.username === username,
    );
    return !user;
  }

  editUser(user: EditUser) {
    const { sessionId, username, userId, newUsername, newRole } = user;
    if (username != newUsername) {
      const usernameExist = this.usernameExist({
        username: newUsername,
        sessionId: sessionId,
        userId: userId,
      } as User);
      if (!usernameExist) {
        return false;
      }
    }
    const roomData = this.room[sessionId];
    const users = this.users[sessionId];
    if (!roomData || !users) {
      return;
    }
    const room = roomData[0];
    const activeUserIndex = room.activeUsers.findIndex(
      (u) => u.username === username,
    );
    if (activeUserIndex !== -1) {
      room.activeUsers[activeUserIndex].username = newUsername;
      room.activeUsers[activeUserIndex].role = newRole;
    }
    const allUserIndex = room.allUsers.findIndex(
      (u) => u.username === username,
    );
    if (allUserIndex !== -1) {
      room.allUsers[allUserIndex].username = newUsername;
      room.allUsers[allUserIndex].role = newRole;
    }
    const userInStore = users.find((u) => u.username === username);
    if (userInStore) {
      userInStore.username = newUsername;
      userInStore.role = newRole;
    }
    const votes = this.voteService.getVotes(user.sessionId);
    const votedField = votes.find((vote) => vote.username === username);
    if (votedField) {
      votedField.username = newUsername;
      votedField.role = newRole;
    }
    return true;
  }
}
