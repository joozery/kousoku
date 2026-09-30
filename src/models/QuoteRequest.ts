import mongoose, { Schema, type Model } from 'mongoose';
import type { QuoteInput } from '@/lib/quote-request-validation';
export interface QuoteRequestDocument extends QuoteInput { createdAt: Date; updatedAt: Date }
const schema = new Schema<QuoteRequestDocument>({
  requestId: { type: String, required: true, unique: true },
  name: { type: String, required: true, maxlength: 100 },
  company: { type: String, maxlength: 150 },
  email: { type: String, required: true, maxlength: 254 },
  phone: { type: String, required: true, maxlength: 30 },
  products: { type: String, required: true, maxlength: 2000 },
  quantity: { type: String, required: true, maxlength: 100 },
  details: { type: String, maxlength: 3000 },
  locale: { type: String, enum: ['th', 'en', 'ja'], required: true },
}, { timestamps: true });
schema.index({ createdAt: -1 });
export default (mongoose.models.QuoteRequest || mongoose.model('QuoteRequest', schema)) as Model<QuoteRequestDocument>;
