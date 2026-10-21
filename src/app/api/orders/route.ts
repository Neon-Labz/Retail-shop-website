import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { User, ICustomerAddress } from '@/models/User';
import { Order } from '@/models/Order';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';
import { generateNextOrderNumber } from '@/lib/orderNumber';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const customerObj = body.customer || {};
    const firstName = body.firstName || customerObj.firstName || '';
    const lastName = body.lastName || customerObj.lastName || '';
    const country = body.country || customerObj.country || '';
    const city = body.city || customerObj.city || '';
    const address = body.address || customerObj.address || '';
    const phone = body.phone || customerObj.phone || '';
    const email = body.email || customerObj.email || '';
    const notes = body.notes || customerObj.notes || '';
    const paymentMethod = body.paymentMethod || 'cod';
    const items = body.items || [];
    const subtotal = body.subtotal || body.total || 0;
    const shipping = body.shipping || 0;
    const discount = body.discount || 0;
    const total = body.total || subtotal;

    if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
      return NextResponse.json(
        { success: false, error: 'First name is required' },
        { status: 400 }
      );
    }

    if (!address || typeof address !== 'string' || !address.trim()) {
      return NextResponse.json(
        { success: false, error: 'Address is required' },
        { status: 400 }
      );
    }

    if (!city || typeof city !== 'string' || !city.trim()) {
      return NextResponse.json(
        { success: false, error: 'Town/City is required' },
        { status: 400 }
      );
    }

    if (!country || typeof country !== 'string' || !country.trim()) {
      return NextResponse.json(
        { success: false, error: 'Country/Region is required' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Your cart is empty' },
        { status: 400 }
      );
    }

    await connectDB();

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const fullName = `${firstName.trim()} ${typeof lastName === 'string' ? lastName.trim() : ''}`.trim() || cleanEmail.split('@')[0] || 'Customer';

    let userId: string | null = null;
    const token =
      request.cookies.get('auth_token')?.value ||
      (request.headers.get('authorization')?.startsWith('Bearer ')
        ? request.headers.get('authorization')?.substring(7)
        : null);

    if (token) {
      const payload = await verifyToken(token);
      if (payload?.userId) {
        userId = payload.userId;
      }
    }

    let customer = userId ? await User.findById(userId) : null;
    if (!customer && cleanEmail) {
      customer = await User.findOne({ email: cleanEmail });
    }

    const orderAddress: ICustomerAddress = {
      label: 'Home',
      line1: address.trim(),
      city: city.trim(),
      country: country.trim(),
      isDefault: true,
    };

    if (customer) {
      if (firstName.trim()) customer.firstName = firstName.trim();
      if (typeof lastName === 'string' && lastName.trim()) customer.lastName = lastName.trim();
      if (phone.trim()) customer.phone = phone.trim();
      customer.name = fullName;

      if (!Array.isArray(customer.addresses)) {
        customer.addresses = [];
      }

      customer.addresses.forEach((a: ICustomerAddress) => {
        a.isDefault = false;
      });

      const existingIdx = customer.addresses.findIndex(
        (a: ICustomerAddress) =>
          a.line1?.trim().toLowerCase() === orderAddress.line1?.toLowerCase() &&
          a.city?.trim().toLowerCase() === orderAddress.city?.toLowerCase()
      );

      if (existingIdx >= 0) {
        customer.addresses[existingIdx] = {
          ...customer.addresses[existingIdx],
          ...orderAddress,
        };
      } else {
        customer.addresses.unshift(orderAddress);
      }

      customer.totalOrders = (customer.totalOrders || 0) + 1;
      customer.totalSpent = (customer.totalSpent || 0) + Number(total);

      await customer.save();
    } else if (cleanEmail) {
      customer = await User.create({
        name: fullName,
        firstName: firstName.trim(),
        lastName: typeof lastName === 'string' ? lastName.trim() : '',
        email: cleanEmail,
        password: 'GUEST_' + Math.random().toString(36).substring(2, 10),
        phone: phone.trim(),
        addresses: [orderAddress],
        isActive: true,
        totalOrders: 1,
        totalSpent: Number(total),
        role: 'customer',
      });
    }

    const formattedItems = items.map((item: any) => ({
      product: mongoose.Types.ObjectId.isValid(item.productId)
        ? new mongoose.Types.ObjectId(item.productId)
        : undefined,
      productId: item.productId || '',
      variantId: item.variantId || '',
      name: item.name || 'Product',
      slug: item.slug || '',
      image: item.image || '',
      sku: item.sku || '',
      color: item.color || '',
      size: item.size || '',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      subtotal: (Number(item.price) || 0) * (Number(item.quantity) || 1),
      vendor: item.vendor || '',
    }));

    let orderNumber: string;
    try {
      orderNumber = await generateNextOrderNumber();
    } catch {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      orderNumber = `ORD-${dateStr}-${randomSuffix}`;
    }

    const order = await Order.create({
      orderNumber,
      customer: customer?._id,
      customerSnapshot: {
        name: fullName,
        email: cleanEmail,
        phone: phone.trim(),
      },
      items: formattedItems,
      billingAddress: {
        fullName,
        line1: address.trim(),
        city: city.trim(),
        country: country.trim(),
        phone: phone.trim(),
      },
      shippingAddress: {
        fullName,
        line1: address.trim(),
        city: city.trim(),
        country: country.trim(),
        phone: phone.trim(),
      },
      subtotal: Number(subtotal),
      discount: Number(discount),
      shippingFee: Number(shipping),
      tax: 0,
      total: Number(total),
      paymentStatus: 'pending',
      paymentMethod: paymentMethod === 'bank' ? 'bank_transfer' : 'cod',
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          changedAt: new Date(),
          note: 'Order placed by customer via store website',
        },
      ],
      notes: typeof notes === 'string' ? notes.trim() : '',
    });

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

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      orderNumber: order.orderNumber,
      orderId: order._id.toString(),
      order,
      customer: customer ? {
        id: customer._id.toString(),
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        addresses: customer.addresses,
      } : undefined,
    });
  } catch (error: unknown) {
    console.error('Create order error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
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
    const customerId = searchParams.get('customerId') || searchParams.get('userId');
    const email = searchParams.get('email');

    await connectDB();

    const query: Record<string, any> = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (customerId && mongoose.Types.ObjectId.isValid(customerId)) {
      query.customer = new mongoose.Types.ObjectId(customerId);
    } else if (email) {
      query['customer.email'] = new RegExp(`^${email.trim()}$`, 'i');
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
