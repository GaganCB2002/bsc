import mongoose from 'mongoose';

const tryOnGenerationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
    },
    productName: {
      type: String,
      default: '',
    },
    productImage: {
      type: String,
      default: '',
    },
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TryOnModel',
    },
    customImageUrl: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      default: 'default',
    },
    providerRequestId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    inputImage: {
      type: String,
      default: '',
    },
    resultImage: {
      type: String,
      default: '',
    },
    errorCode: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    processingTime: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

tryOnGenerationSchema.index({ userId: 1, createdAt: -1 });
tryOnGenerationSchema.index({ status: 1 });
tryOnGenerationSchema.index({ userId: 1, productId: 1 });

const TryOnGeneration = mongoose.model('TryOnGeneration', tryOnGenerationSchema);
export default TryOnGeneration;
