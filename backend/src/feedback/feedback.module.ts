import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
