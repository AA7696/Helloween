import crypto from 'crypto';
import Product from './models/Product';

export const SHIPPING_FLAT = 0;
export const CURRENCY = 'INR';

export const hasRazorpayKeys = () =>
  !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

let razorpayClient = null;
export async function getRazorpay() {
  if (!hasRazorpayKeys()) return null;
  if (!razorpayClient) {
    const { default: Razorpay } = await import('razorpay');
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayClient;
}

// Build authoritative line items + totals from [{ productId, qty }] using DB prices.
export async function buildOrderItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error('No order items provided');
  }
  const ids = rawItems.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids } });
  const map = new Map(products.map((p) => [String(p._id), p]));

  const items = rawItems.map(({ productId, qty }) => {
    const p = map.get(String(productId));
    if (!p) throw new Error(`Product not found: ${productId}`);
    const quantity = Math.max(1, parseInt(qty, 10) || 1);
    return { product: p._id, name: p.name, price: p.price, qty: quantity, imageUrl: p.imageUrl };
  });

  const itemsPrice = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const totalPrice = itemsPrice + SHIPPING_FLAT;
  return { items, itemsPrice, shippingPrice: SHIPPING_FLAT, totalPrice };
}

// In mock mode (no keys) signature verification always passes.
export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  if (!hasRazorpayKeys()) return true;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}
