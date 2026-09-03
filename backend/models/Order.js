import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productSnapshot: {
      name: { type: String, required: true },
      slug: { type: String },
      sku: { type: String },
      images: [{ url: String, alt: String }],
      thumbnail: { type: String },
      variant: {
        name: { type: String },
        value: { type: String },
        sku: { type: String },
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
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
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative'],
    },
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    landmark: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      uppercase: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    guestEmail: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'packed',
        'shipped',
        'out-for-delivery',
        'delivered',
        'cancelled',
        'refunded',
        'returned',
        'partially-returned',
      ],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially-refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'upi', 'netbanking', 'wallet', 'bank-transfer'],
    },
    paymentId: {
      type: String,
      sparse: true,
    },
    paymentDetails: {
      gateway: { type: String },
      transactionId: { type: String },
      response: { type: mongoose.Schema.Types.Mixed },
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
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
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    couponCode: {
      type: String,
      uppercase: true,
      trim: true,
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    shippingAddress: addressSnapshotSchema,
    billingAddress: addressSnapshotSchema,
    shippingMethod: {
      type: String,
      enum: ['standard', 'express', 'same-day'],
      default: 'standard',
    },
    tracking: {
      carrier: { type: String },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
      estimatedDelivery: { type: Date },
      events: [{
        status: { type: String },
        location: { type: String },
        timestamp: { type: Date, default: Date.now },
        description: { type: String },
      }],
    },
    notes: {
      customer: { type: String, maxlength: [1000, 'Customer notes cannot exceed 1000 characters'] },
      internal: { type: String, maxlength: [1000, 'Internal notes cannot exceed 1000 characters'] },
    },
    gift: {
      isGift: { type: Boolean, default: false },
      message: { type: String, maxlength: [500, 'Gift message cannot exceed 500 characters'] },
      wrap: { type: Boolean, default: false },
    },
    cancellation: {
      reason: { type: String },
      cancelledAt: { type: Date },
      cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      refundAmount: { type: Number, default: 0 },
    },
    return: {
      requestedAt: { type: Date },
      reason: { type: String },
      status: {
        type: String,
        enum: ['requested', 'approved', 'rejected', 'received', 'refunded'],
      },
      items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
        reason: { type: String },
        refundAmount: { type: Number },
      }],
      refundAmount: { type: Number, default: 0 },
    },
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
    },
    invoiceUrl: {
      type: String,
    },
    placedAt: {
      type: Date,
      default: Date.now,
    },
    confirmedAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
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

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'tracking.trackingNumber': 1 });

orderSchema.virtual('savings').get(function() {
  return this.items.reduce((sum, item) => {
    const compare = item.comparePrice || 0;
    return sum + (compare - item.price) * item.quantity;
  }, 0);
});

orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

orderSchema.virtual('canCancel').get(function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
});

orderSchema.virtual('canReturn').get(function() {
  if (this.status !== 'delivered') return false;
  const daysSinceDelivery = (Date.now() - this.deliveredAt) / (1000 * 60 * 60 * 24);
  return daysSinceDelivery <= 30;
});

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `BSC${year}${month}${day}${random}`;
  }
  if (!this.invoiceNumber && this.status === 'delivered') {
    this.invoiceNumber = `INV-${this.orderNumber}`;
  }
  this.total = this.subtotal + this.shippingCost + this.tax - this.discount;
  next();
});

orderSchema.methods.addTrackingEvent = function(status, location, description) {
  this.tracking.events.push({ status, location, description, timestamp: new Date() });
  this.tracking.events.sort((a, b) => a.timestamp - b.timestamp);
  return this.save();
};

orderSchema.methods.updateStatus = function(newStatus, userId) {
  const previousStatus = this.status;
  this.status = newStatus;
  this.updatedBy = userId;
  
  if (newStatus === 'confirmed' && !this.confirmedAt) this.confirmedAt = new Date();
  if (newStatus === 'shipped' && !this.shippedAt) this.shippedAt = new Date();
  if (newStatus === 'delivered' && !this.deliveredAt) this.deliveredAt = new Date();
  if (newStatus === 'cancelled') {
    this.cancellation.cancelledAt = new Date();
    this.cancellation.cancelledBy = userId;
  }
  return this.save();
};

const Order = mongoose.model('Order', orderSchema);
export default Order;