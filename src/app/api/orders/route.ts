import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { User, ICustomerAddress } from '@/models/User';
import { Order } from '@/models/Order';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      country,
      city,
      address,
      phone,
      email,
      notes,
      paymentMethod = 'cod',
      items = [],
      subtotal = 0,
    } = body;

    // Validation
    if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
      return NextResponse.json(
        { success: false, error: 'First name is required' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
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

    const cleanEmail = email.toLowerCase().trim();
    const fullName = `${firstName.trim()} ${typeof lastName === 'string' ? lastName.trim() : ''}`.trim() || cleanEmail.split('@')[0];

    // Check token from cookie or authorization header
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

    // Find customer by ID or email
    let customer = userId ? await User.findById(userId) : null;
    if (!customer) {
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
      // Update customer details if empty or updated
      if (firstName.trim()) customer.firstName = firstName.trim();
      if (typeof lastName === 'string' && lastName.trim()) customer.lastName = lastName.trim();
      if (phone.trim()) customer.phone = phone.trim();
      customer.name = fullName;

      // Update addresses list
      if (!Array.isArray(customer.addresses)) {
        customer.addresses = [];
      }

      // Demote existing defaults
      customer.addresses.forEach((a: ICustomerAddress) => {
        a.isDefault = false;
      });

      // Check if address already exists
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
      customer.totalSpent = (customer.totalSpent || 0) + Number(subtotal);

      await customer.save();
    } else {
      // Create customer record so details are remembered next time
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
        totalSpent: Number(subtotal),
        role: 'customer',
      });
    }

    // Format items for order
    const formattedItems = items.map((item: any) => ({
      product: mongoose.Types.ObjectId.isValid(item.productId)
        ? new mongoose.Types.ObjectId(item.productId)
        : undefined,
      productId: item.productId || '',
      name: item.name || 'Product',
      image: item.image || '',
      sku: item.sku || '',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      subtotal: (Number(item.price) || 0) * (Number(item.quantity) || 1),
    }));

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

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
      discount: 0,
      shippingFee: 0,
      tax: 0,
      total: Number(subtotal),
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

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      orderNumber: order.orderNumber,
      customer: {
        id: customer._id.toString(),
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        addresses: customer.addresses,
      },
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
