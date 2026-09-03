import mongoose from 'mongoose';

const tryOnConfigSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      default: 'default',
    },
    maxRequestsPerUser: {
      type: Number,
      default: 50,
    },
    maxImageUploadSizeMB: {
      type: Number,
      default: 10,
    },
    supportedImageFormats: {
      type: [String],
      default: ['image/jpeg', 'image/png', 'image/webp'],
    },
    generationTimeout: {
      type: Number,
      default: 60000,
    },
    concurrentGenerationLimit: {
      type: Number,
      default: 3,
    },
    resultRetentionDays: {
      type: Number,
      default: 30,
    },
    allowGuestUsers: {
      type: Boolean,
      default: false,
    },
    allowImageDownload: {
      type: Boolean,
      default: true,
    },
    allowResultSharing: {
      type: Boolean,
      default: true,
    },
    defaultModelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TryOnModel',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const TryOnConfig = mongoose.model('TryOnConfig', tryOnConfigSchema);
export default TryOnConfig;
