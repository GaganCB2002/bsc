import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['shipping', 'billing', 'both'],
      default: 'both',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+]?[\d\s\-()]{10,15}$/, 'Please provide a valid phone number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required'],
      trim: true,
      maxlength: [200, 'Address line 1 cannot exceed 200 characters'],
    },
    addressLine2: {
      type: String,
      trim: true,
      maxlength: [200, 'Address line 2 cannot exceed 200 characters'],
    },
    landmark: {
      type: String,
      trim: true,
      maxlength: [200, 'Landmark cannot exceed 200 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City cannot exceed 100 characters'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: [100, 'State cannot exceed 100 characters'],
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
      match: [/^\d{6}$/, 'Please provide a valid 6-digit postal code'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'India',
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    instructions: {
      type: String,
      maxlength: [500, 'Delivery instructions cannot exceed 500 characters'],
    },
    tags: [{
      type: String,
      enum: ['home', 'work', 'other'],
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

addressSchema.index({ user: 1, isDefault: 1 });
addressSchema.index({ user: 1, type: 1 });

addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id }, isDefault: true },
      { isDefault: false }
    );
  }
  next();
});

addressSchema.methods.getFormattedAddress = function() {
  const parts = [
    this.name,
    this.addressLine1,
    this.addressLine2,
    this.landmark,
    `${this.city}, ${this.state} ${this.postalCode}`,
    this.country,
  ].filter(Boolean);
  return parts.join(', ');
};

addressSchema.virtual('fullAddress').get(function() {
  return this.getFormattedAddress();
});

const Address = mongoose.model('Address', addressSchema);
export default Address;