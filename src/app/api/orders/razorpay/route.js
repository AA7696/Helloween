import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { buildOrderItems, getRazorpay, hasRazorpayKeys, CURRENCY } from '@/lib/orders';

// POST /api/orders/razorpay — create a Razorpay order (amount computed server-side)
export async function POST(req) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

  try {
    const { items } = await req.json();
    await connectDB();
    const { totalPrice } = await buildOrderItems(items);
    const amountPaise = Math.round(totalPrice * 100);

    const rzp = await getRazorpay();
    if (!rzp) {
      // Mock fallback — no real keys configured.
      return NextResponse.json({
        mock: true,
        keyId: 'mock',
        orderId: 'mock_order_' + Date.now(),
        amount: amountPaise,
        currency: CURRENCY,
      });
    }

    const rzpOrder = await rzp.orders.create({
      amount: amountPaise,
      currency: CURRENCY,
      receipt: 'rcpt_' + Date.now(),
    });
    return NextResponse.json({
      mock: false,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
