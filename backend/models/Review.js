import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    images: [{
      url: { type: String, required: true },
      alt: { type: String },
    }],
    variant: {
      name: { type: String },
      value: { type: String },
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true,
    },
    isRecommended: {
      type: Boolean,
      default: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    unhelpfulCount: {
      type: Number,
      default: 0,
    },
    helpfulUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    unhelpfulUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    response: {
      comment: { type: String, maxlength: [1000, 'Response cannot exceed 1000 characters'] },
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      respondedAt: { type: Date },
    },
    metadata: {
      ip: { type: String },
      userAgent: { type: String },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, isApproved: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

reviewSchema.virtual('helpfulPercentage').get(function() {
  const total = this.helpfulCount + this.unhelpfulCount;
  if (total === 0) return 0;
  return Math.round((this.helpfulCount / total) * 100);
});

reviewSchema.pre('save', async function(next) {
  if (this.isNew && this.order) {
    const Order = mongoose.model('Order');
    const order = await Order.findById(this.order);
    if (order) {
      this.isVerifiedPurchase = true;
    }
  }
  next();
});

reviewSchema.post('save', async function() {
  await this.constructor.updateProductRating(this.product);
});

reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await this.constructor.updateProductRating(doc.product);
  }
});

reviewSchema.statics.updateProductRating = async function(productId) {
  const Product = mongoose.model('Product');
  const stats = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 },
        distribution: {
          $push: '$rating',
        },
      },
    },
  ]);

  if (stats.length > 0) {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    stats[0].distribution.forEach(rating => {
      if (dist[rating] !== undefined) dist[rating]++;
    });

    await Product.findByIdAndUpdate(productId, {
      'rating.average': Math.round(stats[0].averageRating * 10) / 10,
      'rating.count': stats[0].count,
      'rating.distribution': dist,
      reviewsCount: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      'rating.average': 0,
      'rating.count': 0,
      'rating.distribution': { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      reviewsCount: 0,
    });
  }
};

const Review = mongoose.model('Review', reviewSchema);
export default Review;