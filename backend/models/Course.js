import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    estimatedDuration: {
      type: String,
      default: '',
    },
    instructor: {
      type: String,
      default: 'BS Channabasappa Academy',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String, trim: true }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for modules
courseSchema.virtual('modules', {
  ref: 'Module',
  localField: '_id',
  foreignField: 'courseId',
  options: { sort: { order: 1 } },
});

courseSchema.index({ status: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ title: 'text', description: 'text' });

const Course = mongoose.model('Course', courseSchema);
export default Course;
