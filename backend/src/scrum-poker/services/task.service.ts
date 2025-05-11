import { Injectable } from '@nestjs/common';
import { StoreService } from '@store/store.service';
import { nextTask, Task } from '@dto/room';

@Injectable()
export class TaskService {
  constructor(private readonly storeService: StoreService) {}

  private get room() {
    return this.storeService.getRoomStorage();
  }
  private get votes() {
    return this.storeService.getVoteStorage();
  }

  createTasks(tasks: string[]) {
    if (tasks.length === 0) return [];
    return tasks.map(
      (task, index) =>
        ({
          task: task,
          taskStatus: index === 0 ? 'VOTING' : 'WAITING',
        }) as Task,
    );
  }

  nextTask(task: nextTask) {
    const room = this.room[task.sessionId];
    const tasks = room[0].tasks;
    const currentTask = tasks.find((t) => t.taskStatus === 'VOTING');
    if (!currentTask) {
      return null;
    }
    const currentIndex = tasks.indexOf(currentTask);
    const nextIndex = currentIndex + 1;
    if (nextIndex < tasks.length) {
      currentTask.taskStatus = 'COMPLETED';
      tasks[nextIndex].taskStatus = 'VOTING';
      this.votes[task.sessionId] = [];
      return tasks;
    } else {
      currentTask.taskStatus = 'COMPLETED';
      this.votes[task.sessionId] = [];
      return tasks;
    }
  }

  getTaskList(sessionId: string) {
    const room = this.room[sessionId];
    if (!room) {
      return null;
    }
    return room[0].tasks;
  }
}
