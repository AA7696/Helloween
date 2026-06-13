import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { getCurrentUser } from '@/lib/auth';
import { buildOrderItems, verifyRazorpaySignature } from '@/lib/orders';

// POST /api/orders — place an order (COD or Razorpay after payment)
export async function POST(req) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

  try {
    const { items, shippingAddress, paymentMethod, razorpay } = await req.json();
    const a = shippingAddress || {};
    if (!a.fullName || !a.phone || !a.address || !a.city || !a.postalCode) {
      return NextResponse.json({ message: 'Complete shipping address is required.' }, { status: 400 });
    }
    if (!['Razorpay', 'COD'].includes(paymentMethod)) {
      return NextResponse.json({ message: 'Invalid payment method.' }, { status: 400 });
    }

    await connectDB();
    const { items: orderItems, itemsPrice, shippingPrice, totalPrice } = await buildOrderItems(items);

    let paymentStatus = 'Pending';
    let isPaid = false;
    let paidAt = null;
    let razorpayData = {};

    if (paymentMethod === 'Razorpay') {
      const ok = verifyRazorpaySignature({
        orderId: razorpay?.orderId,
        paymentId: razorpay?.paymentId,
        signature: razorpay?.signature,
      });
      if (!ok) return NextResponse.json({ message: 'Payment verification failed.' }, { status: 400 });
      paymentStatus = 'Paid';
      isPaid = true;
      paidAt = new Date();
      razorpayData = { orderId: razorpay?.orderId, paymentId: razorpay?.paymentId, signature: razorpay?.signature };
    }

    const order = await Order.create({
      user: me._id,
      items: orderItems,
      shippingAddress: a,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentMethod,
      paymentStatus,
      razorpay: razorpayData,
      isPaid,
      paidAt,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// GET /api/orders — all orders (admin)
export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  if (me.role !== 'admin') return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 403 });

  await connectDB();
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  return NextResponse.json(orders);
}
