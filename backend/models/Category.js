import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    level: {
      type: Number,
      default: 0,
    },
    path: {
      type: String,
      index: true,
    },
    image: {
      url: { type: String },
      alt: { type: String },
    },
    icon: {
      type: String,
    },
    order: {
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
    },
    seo: {
      metaTitle: { type: String, maxlength: [60, 'Meta title cannot exceed 60 characters'] },
      metaDescription: { type: String, maxlength: [160, 'Meta description cannot exceed 160 characters'] },
      keywords: [{ type: String }],
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.index({ parent: 1, order: 1 });
categorySchema.index({ slug: 1 }, { unique: true });

categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
});

categorySchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

categorySchema.pre('save', async function(next) {
  if (this.parent) {
    const parentCat = await this.constructor.findById(this.parent);
    if (parentCat) {
      this.level = parentCat.level + 1;
      this.path = parentCat.path ? `${parentCat.path}/${this.slug}` : this.slug;
    }
  } else {
    this.level = 0;
    this.path = this.slug;
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;