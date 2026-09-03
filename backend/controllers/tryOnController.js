import mongoose from 'mongoose';
import TryOnConfig from '../models/TryOnConfig.js';
import TryOnModel from '../models/TryOnModel.js';
import TryOnGeneration from '../models/TryOnGeneration.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// --- PUBLIC / CUSTOMER ENDPOINTS ---

// @desc    Get public config and active models
// @route   GET /api/try-on/config
// @access  Public
export const getTryOnConfig = asyncHandler(async (req, res) => {
  let config = await TryOnConfig.findOne();
  if (!config) {
    config = await TryOnConfig.create({});
  }
  
  const models = await TryOnModel.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
  
  res.status(200).json({
    success: true,
    data: {
      config: {
        enabled: config.enabled,
        maxRequestsPerUser: config.maxRequestsPerUser,
        maxImageUploadSizeMB: config.maxImageUploadSizeMB,
        supportedImageFormats: config.supportedImageFormats,
        allowGuestUsers: config.allowGuestUsers,
        allowImageDownload: config.allowImageDownload,
        allowResultSharing: config.allowResultSharing,
        defaultModelId: config.defaultModelId,
      },
      models
    }
  });
});

// @desc    Get active models
// @route   GET /api/try-on/models
// @access  Public
export const getActiveModels = asyncHandler(async (req, res) => {
  const models = await TryOnModel.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
  res.status(200).json({ success: true, count: models.length, data: models });
});

// @desc    Generate Virtual Try-On
// @route   POST /api/try-on/generate
// @access  Private / Public (depending on config)
export const generateTryOn = asyncHandler(async (req, res) => {
  let config = await TryOnConfig.findOne();
  if (!config) config = await TryOnConfig.create({});
  
  if (!config.enabled) {
    return res.status(403).json({ success: false, message: 'Virtual Try-On feature is currently disabled' });
  }

  // Handle guest check
  if (!req.user && !config.allowGuestUsers) {
    return res.status(401).json({ success: false, message: 'Login required to use Virtual Try-On' });
  }

  const { productId, productName, productImage, modelId, customImageUrl } = req.body;

  if (!productId || !productImage) {
    return res.status(400).json({ success: false, message: 'Product ID and Image are required' });
  }

  if (!modelId && !customImageUrl) {
    return res.status(400).json({ success: false, message: 'Either a preset Model ID or a Custom Image is required' });
  }

  // In a real implementation, we would call an AI service here (e.g. Gemini, Replicate, Stable Diffusion)
  // For this implementation, we simulate the processing
  
  // Create generation record
  let inputImage = customImageUrl || '';
  if (!inputImage && modelId) {
    if (!mongoose.Types.ObjectId.isValid(modelId)) {
      return res.status(400).json({ success: false, message: 'Invalid model ID' });
    }
    const modelDoc = await TryOnModel.findById(modelId);
    if (modelDoc) inputImage = modelDoc.imageUrl || '';
  }

  const generation = await TryOnGeneration.create({
    userId: req.user ? req.user._id : null,
    productId,
    productName,
    productImage,
    modelId: modelId || null,
    customImageUrl: customImageUrl || '',
    provider: config.provider,
    status: 'processing',
    inputImage,
  });

  // Simulate processing time and result
  const processingTime = Math.floor(Math.random() * (2500 - 1200) + 1200);

  // Fake success/failure (95% success rate)
  const isSuccess = Math.random() < 0.95;

  // Fire-and-forget background update. The async body MUST not throw or the
  // process logs an UnhandledPromiseRejection; wrap in try/catch.
  setTimeout(() => {
    (async () => {
      try {
        if (isSuccess) {
          await TryOnGeneration.findByIdAndUpdate(generation._id, {
            status: 'completed',
            resultImage: productImage,
            processingTime,
            completedAt: Date.now(),
          });
        } else {
          await TryOnGeneration.findByIdAndUpdate(generation._id, {
            status: 'failed',
            errorCode: 'ERR_AI_RENDER_FAILED',
            errorMessage: 'Failed to map garment to silhouette',
            processingTime,
            completedAt: Date.now(),
          });
        }
      } catch (err) {
        console.error('[tryOn] background update failed:', err);
      }
    })();
  }, processingTime);

  // Return immediately with 'processing' status (client will poll or we just wait slightly)
  res.status(202).json({
    success: true,
    message: 'Try-On generation started',
    data: generation
  });
});

// @desc    Get user's generations
// @route   GET /api/try-on/history
// @access  Private
export const getUserGenerations = asyncHandler(async (req, res) => {
  const generations = await TryOnGeneration.find({ userId: req.user._id })
    .populate('modelId', 'name imageUrl')
    .sort({ createdAt: -1 })
    .limit(20);
    
  res.status(200).json({ success: true, count: generations.length, data: generations });
});

// @desc    Get generation by ID
// @route   GET /api/try-on/generation/:id
// @access  Public (or Private)
export const getGenerationById = asyncHandler(async (req, res) => {
  const generation = await TryOnGeneration.findById(req.params.id).populate('modelId', 'name imageUrl');
  if (!generation) {
    return res.status(404).json({ success: false, message: 'Generation not found' });
  }
  res.status(200).json({ success: true, data: generation });
});


// --- ADMIN MANAGEMENT ENDPOINTS ---

// @desc    Get admin stats
// @route   GET /api/try-on/admin/stats
// @access  Private/Admin
export const adminGetStats = asyncHandler(async (req, res) => {
  const totalGenerations = await TryOnGeneration.countDocuments();
  const successfulGenerations = await TryOnGeneration.countDocuments({ status: 'completed' });
  const failedGenerations = await TryOnGeneration.countDocuments({ status: 'failed' });
  const activeModelsCount = await TryOnModel.countDocuments({ isActive: true });
  
  const successRate = totalGenerations > 0 
    ? Math.round((successfulGenerations / totalGenerations) * 100) 
    : 0;

  const recentGenerations = await TryOnGeneration.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('modelId', 'name')
    .populate('userId', 'name email');

  // Calculate average processing time
  const completedGens = await TryOnGeneration.find({ status: 'completed', processingTime: { $gt: 0 } });
  const avgProcessingTime = completedGens.length > 0
    ? Math.round(completedGens.reduce((acc, curr) => acc + curr.processingTime, 0) / completedGens.length)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      totalGenerations,
      successfulGenerations,
      failedGenerations,
      successRate,
      activeModelsCount,
      avgProcessingTime,
      recentGenerations
    }
  });
});

// @desc    Get admin config
// @route   GET /api/try-on/admin/config
// @access  Private/Admin
export const adminGetConfig = asyncHandler(async (req, res) => {
  let config = await TryOnConfig.findOne();
  if (!config) config = await TryOnConfig.create({});
  res.status(200).json({ success: true, data: config });
});

// @desc    Update admin config
// @route   PUT /api/try-on/admin/config
// @access  Private/Admin
const CONFIG_UPDATABLE = [
  'enabled', 'provider', 'maxRequestsPerUser', 'maxImageUploadSizeMB',
  'supportedImageFormats', 'generationTimeout', 'concurrentGenerationLimit',
  'resultRetentionDays', 'allowGuestUsers', 'allowImageDownload',
  'allowResultSharing', 'defaultModelId',
];
export const adminUpdateConfig = asyncHandler(async (req, res) => {
  const updates = {};
  for (const k of CONFIG_UPDATABLE) {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  }
  let config = await TryOnConfig.findOne();
  if (!config) {
    config = await TryOnConfig.create(updates);
  } else {
    config = await TryOnConfig.findByIdAndUpdate(config._id, updates, { new: true, runValidators: true });
  }
  res.status(200).json({ success: true, data: config });
});

// @desc    Get all models (Admin)
// @route   GET /api/try-on/admin/models
// @access  Private/Admin
export const adminGetModels = asyncHandler(async (req, res) => {
  const models = await TryOnModel.find().sort({ sortOrder: 1, createdAt: -1 });
  res.status(200).json({ success: true, count: models.length, data: models });
});

// @desc    Create a model
// @route   POST /api/try-on/admin/models
// @access  Private/Admin
const MODEL_UPDATABLE = ['name', 'imageUrl', 'gender', 'isActive', 'isDefault', 'description', 'sortOrder'];
export const adminCreateModel = asyncHandler(async (req, res) => {
  // Strict allowlist — never spread req.body.
  const safe = {};
  for (const k of MODEL_UPDATABLE) {
    if (req.body[k] !== undefined) safe[k] = req.body[k];
  }
  if (!safe.name || !safe.imageUrl) {
    return res.status(400).json({ success: false, message: 'name and imageUrl are required' });
  }
  if (safe.isDefault) {
    await TryOnModel.updateMany({}, { isDefault: false });
  }
  const model = await TryOnModel.create(safe);
  res.status(201).json({ success: true, data: model });
});

// @desc    Update a model
// @route   PUT /api/try-on/admin/models/:id
// @access  Private/Admin
export const adminUpdateModel = asyncHandler(async (req, res) => {
  const updates = {};
  for (const k of MODEL_UPDATABLE) {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  }
  let model = await TryOnModel.findById(req.params.id);
  if (!model) return res.status(404).json({ success: false, message: 'Model not found' });

  if (updates.isDefault && !model.isDefault) {
    await TryOnModel.updateMany({}, { isDefault: false });
  }

  model = await TryOnModel.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: model });
});

// @desc    Delete a model
// @route   DELETE /api/try-on/admin/models/:id
// @access  Private/Admin
export const adminDeleteModel = asyncHandler(async (req, res) => {
  const model = await TryOnModel.findById(req.params.id);
  if (!model) return res.status(404).json({ success: false, message: 'Model not found' });
  await model.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Get generations log
// @route   GET /api/try-on/admin/generations
// @access  Private/Admin
export const adminGetGenerations = asyncHandler(async (req, res) => {
  let limit = parseInt(req.query.limit, 10) || 50;
  if (limit < 1) limit = 50;
  if (limit > 200) limit = 200;
  const status = req.query.status;

  let query = {};
  if (status && status !== 'all') {
    query.status = status;
  }

  const generations = await TryOnGeneration.find(query)
    .populate('userId', 'name email')
    .populate('modelId', 'name imageUrl')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({ success: true, count: generations.length, data: generations });
});

// @desc    Delete a generation
// @route   DELETE /api/try-on/admin/generations/:id
// @access  Private/Admin
export const adminDeleteGeneration = asyncHandler(async (req, res) => {
  const generation = await TryOnGeneration.findById(req.params.id);
  if (!generation) return res.status(404).json({ success: false, message: 'Generation not found' });
  await generation.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
