import connectDB from '@/lib/mongodb';
import QuoteRequest from '@/models/QuoteRequest';
import { validateQuoteRequest } from '@/lib/quote-request-validation';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Invalid origin' }, { status: 403 });
  let payload: unknown;
  try {
    const body = await request.text();
    if (body.length > 16000) return Response.json({ error: 'Request too large' }, { status: 413 });
    payload = JSON.parse(body);
  } catch { return Response.json({ error: 'Invalid request' }, { status: 400 }); }
  const data = validateQuoteRequest(payload);
  if (!data) return Response.json({ error: 'Invalid fields' }, { status: 400 });
  try {
    await connectDB();
    await QuoteRequest.updateOne({ requestId: data.requestId }, { $setOnInsert: data }, { upsert: true, runValidators: true });
    return Response.json({ reference: data.requestId }, { status: 201 });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return Response.json({ reference: data.requestId }, { status: 201 });
    }
    return Response.json({ error: 'Unable to save request' }, { status: 503 });
  }
}
