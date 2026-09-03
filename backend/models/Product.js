import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    comparePrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative'],
    },
    costPrice: {
      type: Number,
      min: [0, 'Cost price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['men', 'women', 'kids'],
      index: true,
    },
    subcategory: {
      type: String,
      required: [true, 'Subcategory is required'],
      index: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    images: [{
      url: { type: String, required: true },
      alt: { type: String },
      isPrimary: { type: Boolean, default: false },
    }],
    thumbnail: {
      type: String,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    inventory: {
      quantity: {
        type: Number,
        default: 0,
        min: [0, 'Inventory quantity cannot be negative'],
      },
      lowStockThreshold: {
        type: Number,
        default: 10,
      },
      trackQuantity: {
        type: Boolean,
        default: true,
      },
      allowBackorder: {
        type: Boolean,
        default: false,
      },
    },
    variants: [{
      name: { type: String, required: true },
      options: [{
        value: { type: String, required: true },
        priceAdjustment: { type: Number, default: 0 },
        sku: { type: String },
        inventory: { type: Number, default: 0 },
        image: { type: String },
      }],
    }],
    specifications: [{
      name: { type: String, required: true },
      value: { type: String, required: true },
      group: { type: String },
    }],
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be more than 5'],
      },
      count: {
        type: Number,
        default: 0,
      },
      distribution: {
        5: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        1: { type: Number, default: 0 },
      },
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    saleStartDate: {
      type: Date,
    },
    saleEndDate: {
      type: Date,
    },
    virtualTryOn: {
      type: Boolean,
      default: false,
    },
    garmentType: {
      type: String,
      enum: ['top', 'bottom', 'dress', 'outerwear', 'accessory'],
    },
    ageGroups: [{
      type: String,
      enum: ['teens', 'young-adults', 'adults', 'mature-adults', 'seniors'],
    }],
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
    },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    shippingClass: {
      type: String,
      enum: ['standard', 'fragile', 'oversized', 'free'],
      default: 'standard',
    },
    seo: {
      metaTitle: { type: String, maxlength: [60, 'Meta title cannot exceed 60 characters'] },
      metaDescription: { type: String, maxlength: [160, 'Meta description cannot exceed 160 characters'] },
      keywords: [{ type: String }],
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

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });

productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

productSchema.virtual('inStock').get(function() {
  if (!this.inventory.trackQuantity) return true;
  return this.inventory.quantity > 0 || this.inventory.allowBackorder;
});

productSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);
  }
  if (this.images && this.images.length > 0 && !this.thumbnail) {
    const primary = this.images.find(img => img.isPrimary) || this.images[0];
    this.thumbnail = primary.url;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;