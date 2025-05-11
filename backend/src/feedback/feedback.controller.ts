import { Body, Controller, Post } from '@nestjs/common';
import { FeedbackRepository } from '@repositories/feedback';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly databaseService: FeedbackRepository) {}

  @Post()
  async createFeedback(@Body() body: { email: string; message: string }) {
    return this.databaseService.insertFeedback(body.email, body.message);
  }
}
