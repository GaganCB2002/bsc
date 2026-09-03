import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, 'Coupon code cannot exceed 20 characters'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Coupon name is required'],
      trim: true,
      maxlength: [100, 'Coupon name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'free-shipping', 'buy-x-get-y'],
      required: [true, 'Coupon type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Coupon value is required'],
      min: [0, 'Value cannot be negative'],
    },
    maxDiscount: {
      type: Number,
      min: [0, 'Max discount cannot be negative'],
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, 'Minimum order amount cannot be negative'],
    },
    maxUses: {
      type: Number,
      min: [1, 'Max uses must be at least 1'],
    },
    maxUsesPerUser: {
      type: Number,
      default: 1,
      min: [1, 'Max uses per user must be at least 1'],
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    usersUsed: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      count: { type: Number, default: 1 },
      usedAt: { type: Date, default: Date.now },
    }],
    applicableProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
    applicableCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
    excludedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
    excludedCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    firstTimeOnly: {
      type: Boolean,
      default: false,
    },
    newUsersOnly: {
      type: Boolean,
      default: false,
    },
    stackable: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
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

couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
couponSchema.index({ createdAt: -1 });

couponSchema.virtual('isExpired').get(function() {
  return this.endDate && new Date() > this.endDate;
});

couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive
    && (!this.startDate || now >= this.startDate)
    && (!this.endDate || now <= this.endDate)
    && (!this.maxUses || this.usedCount < this.maxUses);
});

couponSchema.virtual('remainingUses').get(function() {
  if (!this.maxUses) return Infinity;
  return Math.max(0, this.maxUses - this.usedCount);
});

couponSchema.methods.canApply = function(user, cart) {
  if (!this.isValid) return { valid: false, reason: 'Coupon has expired or reached usage limit' };
  
  if (this.minOrderAmount && cart.subtotal < this.minOrderAmount) {
    return { valid: false, reason: `Minimum order amount of ₹${this.minOrderAmount} required` };
  }

  if (this.maxUsesPerUser) {
    const userUsage = this.usersUsed.find(u => u.user.toString() === user._id.toString());
    if (userUsage && userUsage.count >= this.maxUsesPerUser) {
      return { valid: false, reason: 'You have already used this coupon the maximum number of times' };
    }
  }

  if (this.firstTimeOnly) {
    const Order = mongoose.model('Order');
    // This would need to be checked async, returning promise
  }

  if (this.newUsersOnly) {
    // Check if user has any completed orders
  }

  if (this.applicableProducts.length > 0 || this.applicableCategories.length > 0) {
    const hasApplicableItem = cart.items.some(item => {
      const productId = item.product.toString();
      const isProductApplicable = this.applicableProducts.some(p => p.toString() === productId);
      // Category check would need product population
      return isProductApplicable;
    });
    if (!hasApplicableItem) {
      return { valid: false, reason: 'Coupon is not applicable to items in your cart' };
    }
  }

  if (this.excludedProducts.length > 0 || this.excludedCategories.length > 0) {
    const hasExcludedItem = cart.items.some(item => {
      const productId = item.product.toString();
      return this.excludedProducts.some(p => p.toString() === productId);
    });
    if (hasExcludedItem) {
      return { valid: false, reason: 'Coupon cannot be applied to some items in your cart' };
    }
  }

  return { valid: true };
};

couponSchema.methods.calculateDiscount = function(cart) {
  let discount = 0;
  
  if (this.type === 'percentage') {
    discount = (cart.subtotal * this.value) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else if (this.type === 'fixed') {
    discount = this.value;
    if (discount > cart.subtotal) discount = cart.subtotal;
  } else if (this.type === 'free-shipping') {
    discount = cart.shippingCost;
  }
  // buy-x-get-y logic would be more complex
  
  return Math.min(discount, cart.subtotal);
};

couponSchema.methods.recordUsage = function(user) {
  this.usedCount += 1;
  const userUsage = this.usersUsed.find(u => u.user.toString() === user._id.toString());
  if (userUsage) {
    userUsage.count += 1;
    userUsage.usedAt = new Date();
  } else {
    this.usersUsed.push({ user: user._id, count: 1, usedAt: new Date() });
  }
  return this.save();
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;