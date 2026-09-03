import mongoose from 'mongoose';

const tryOnModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Model image URL is required'],
    },
    gender: {
      type: String,
      enum: ['female', 'male', 'unisex'],
      default: 'female',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

tryOnModelSchema.index({ isActive: 1 });
tryOnModelSchema.index({ isDefault: 1 });

const TryOnModel = mongoose.model('TryOnModel', tryOnModelSchema);
export default TryOnModel;
