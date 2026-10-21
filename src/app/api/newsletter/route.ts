import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const conn = await connectDB();
    const db = conn.connection.db;
    if (!db) {
      throw new Error('Database connection unavailable');
    }

    await db.collection('newsletter_subscribers').updateOne(
      { email: cleanEmail },
      {
        $set: {
          email: cleanEmail,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          subscribedAt: new Date(),
          status: 'active',
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'You have been successfully subscribed to our newsletter!',
    });
  } catch (err: any) {
    console.error('Error in /api/newsletter:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
