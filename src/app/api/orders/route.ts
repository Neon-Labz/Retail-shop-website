import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer,
      items,
      subtotal,
      shipping = 0,
      discount = 0,
      total,
      paymentMethod = 'bank',
    } = body;

    // Validate customer info
    if (!customer?.firstName || !customer?.lastName || !customer?.phone || !customer?.address || !customer?.country || !customer?.city) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required billing fields.' },
        { status: 400 }
      );
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Your cart is empty.' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Generate unique, readable order number: ORD-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    // Create Order document in MongoDB
    const order = await Order.create({
      orderNumber,
      customer: {
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        country: customer.country.trim(),
        city: customer.city.trim(),
        address: customer.address.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || '',
        notes: customer.notes?.trim() || '',
      },
      items: items.map((item: any) => ({
        productId: String(item.productId),
        variantId: item.variantId || '',
        name: item.name,
        slug: item.slug || '',
        image: item.image || '',
        color: item.color || '',
        size: item.size || '',
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        vendor: item.vendor || '',
      })),
      subtotal: Number(subtotal),
      shipping: Number(shipping),
      discount: Number(discount),
      total: Number(total),
      paymentMethod: paymentMethod === 'cod' ? 'cod' : 'bank',
      paymentStatus: 'pending',
      status: 'pending',
    });

    // Attempt to decrement stock in MongoDB products if applicable
    for (const item of items) {
      if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
        try {
          await Product.updateOne(
            { _id: item.productId, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity, totalSold: item.quantity } }
          );
        } catch (stockErr) {
          console.warn(`Could not update stock for product ${item.productId}:`, stockErr);
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        orderNumber: order.orderNumber,
        orderId: order._id.toString(),
        order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order in /api/orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to place order.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '20'));
    const status = searchParams.get('status');

    await connectDB();

    const query: Record<string, any> = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      orders,
    });
  } catch (error: any) {
    console.error('Error fetching orders in /api/orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders.' },
      { status: 500 }
    );
  }
}
