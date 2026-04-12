import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'shop_admin', 'cashier', 'salesman'], default: 'cashier' },
  shopId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Shop',
    required: function() {
      // Super admins do not belong to a single shop
      return this.role !== 'super_admin';
    }
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  preferredShift: { type: String, enum: ['day', 'night', 'both'], default: 'both' },
  phoneNumber: { type: String },
  lastLogged: { type: Date }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
