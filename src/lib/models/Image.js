import mongoose from 'mongoose';

// Product images are stored in MongoDB so uploads work on serverless hosts
// (Vercel/Lambda) where the filesystem is read-only. Served via /api/images/[id].
const ImageSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Image || mongoose.model('Image', ImageSchema);
