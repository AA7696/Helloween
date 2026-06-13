import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Energy Drink', 'Functional Drink'] },
  caffeine: { type: String, default: '32 mg/100 ml' },
  price: { type: Number, required: true, default: 120, min: 0 },
  stock: { type: Number, default: 100, min: 0 },
  vitamins: { type: [String], default: ['B2', 'B3', 'B5', 'B6', 'B12'] },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
