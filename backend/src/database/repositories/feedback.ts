import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Feedback } from "@entities/feedback";
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FeedbackRepository {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async insertFeedback(email: string, message: string) {
    const feedback = this.feedbackRepository.create({ email, message });
    return this.feedbackRepository.save(feedback);
  }
}
