import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { getCurrentUser } from '@/lib/auth';

// PUT /api/orders/:id — update order status (admin)
export async function PUT(req, { params }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  if (me.role !== 'admin') return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 403 });

  try {
    const { orderStatus } = await req.json();
    const allowed = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(orderStatus)) {
      return NextResponse.json({ message: 'Invalid order status.' }, { status: 400 });
    }
    await connectDB();
    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'Paid';
      order.isPaid = true;
      order.paidAt = new Date();
    }
    const updated = await order.save();
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: 'Server error: ' + err.message }, { status: 500 });
  }
}
