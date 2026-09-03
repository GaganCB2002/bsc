import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variant: {
      name: { type: String },
      value: { type: String },
      sku: { type: String },
      priceAdjustment: { type: Number, default: 0 },
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    comparePrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative'],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      sparse: true,
    },
    sessionId: {
      type: String,
      index: true,
      sparse: true,
    },
    items: [cartItemSchema],
    couponCode: {
      type: String,
      uppercase: true,
      trim: true,
    },
    couponDiscount: {
      type: Number,
      default: 0,
      min: [0, 'Coupon discount cannot be negative'],
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    billingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    shippingMethod: {
      type: String,
      enum: ['standard', 'express', 'same-day'],
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cost cannot be negative'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartSchema.index({ user: 1 }, { unique: true, sparse: true });
cartSchema.index({ sessionId: 1 }, { unique: true, sparse: true });
cartSchema.index({ updatedAt: -1 });

cartSchema.virtual('subtotal').get(function() {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

cartSchema.virtual('total').get(function() {
  return this.subtotal + this.shippingCost + this.tax - this.couponDiscount;
});

cartSchema.virtual('savings').get(function() {
  return this.items.reduce((sum, item) => {
    const compare = item.comparePrice || 0;
    return sum + (compare - item.price) * item.quantity;
  }, 0);
});

cartSchema.methods.addItem = function(product, quantity = 1, variant = null) {
  const existingIndex = this.items.findIndex(item => {
    const sameProduct = item.product.toString() === product._id.toString();
    const sameVariant = !variant && !item.variant?.name
      || (variant && item.variant?.name === variant.name && item.variant?.value === variant.value);
    return sameProduct && sameVariant;
  });

  const price = product.price + (variant?.priceAdjustment || 0);
  const comparePrice = product.comparePrice;

  if (existingIndex > -1) {
    this.items[existingIndex].quantity += quantity;
    this.items[existingIndex].price = price;
  } else {
    this.items.push({
      product: product._id,
      variant,
      quantity,
      price,
      comparePrice,
      addedAt: new Date(),
    });
  }
  return this.save();
};

cartSchema.methods.removeItem = function(productId, variant = null) {
  this.items = this.items.filter(item => {
    const sameProduct = item.product.toString() === productId.toString();
    const sameVariant = !variant && !item.variant?.name
      || (variant && item.variant?.name === variant.name && item.variant?.value === variant.value);
    return !(sameProduct && sameVariant);
  });
  return this.save();
};

cartSchema.methods.updateQuantity = function(productId, quantity, variant = null) {
  const item = this.items.find(item => {
    const sameProduct = item.product.toString() === productId.toString();
    const sameVariant = !variant && !item.variant?.name
      || (variant && item.variant?.name === variant.name && item.variant?.value === variant.value);
    return sameProduct && sameVariant;
  });
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId, variant);
    }
    item.quantity = quantity;
    return this.save();
  }
  throw new Error('Item not found in cart');
};

cartSchema.methods.clear = function() {
  this.items = [];
  this.couponCode = undefined;
  this.couponDiscount = 0;
  return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;