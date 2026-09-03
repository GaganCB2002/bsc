import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'course_opened',
        'course_created',
        'course_updated',
        'course_archived',
        'section_opened',
        'section_completed',
        'quiz_attempted',
        'quiz_passed',
        'course_completed',
        'profile_updated',
        'user_deleted',
        'login',
      ],
      required: true,
    },
    metadata: {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
      quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
      courseName: String,
      sectionName: String,
      quizName: String,
      score: Number,
      details: String,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ type: 1 });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
