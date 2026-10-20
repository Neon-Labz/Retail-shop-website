import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    const readyState = mongoose.connection.readyState;
    const dbName = mongoose.connection.db?.databaseName;

    return NextResponse.json({
      success: true,
      status: 'connected',
      database: dbName,
      readyState: readyState,
      message: 'MongoDB connected successfully',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        error: message,
      },
      { status: 500 }
    );
  }
}
