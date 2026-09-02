import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    estimatedDuration: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for sections
moduleSchema.virtual('sections', {
  ref: 'Section',
  localField: '_id',
  foreignField: 'moduleId',
  options: { sort: { order: 1 } },
});

moduleSchema.index({ courseId: 1, order: 1 });

const Module = mongoose.model('Module', moduleSchema);
export default Module;
