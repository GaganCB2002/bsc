import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Module ID is required'],
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Section title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
    },
    contentType: {
      type: String,
      enum: ['text', 'video', 'quiz', 'exercise'],
      default: 'text',
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    estimatedTime: {
      type: Number, // in minutes
      default: 10,
    },
    resources: [
      {
        title: String,
        url: String,
        type: { type: String, enum: ['link', 'pdf', 'video'] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

sectionSchema.index({ courseId: 1, order: 1 });
sectionSchema.index({ moduleId: 1, order: 1 });

const Section = mongoose.model('Section', sectionSchema);
export default Section;
