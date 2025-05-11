import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from '@entities/feedback';
import { FeedbackRepository } from '@repositories/feedback';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback])],
  providers: [FeedbackRepository],
  exports: [FeedbackRepository],
})
export class DatabaseModule {}
