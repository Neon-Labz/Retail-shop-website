import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

async function getUserId(request: NextRequest): Promise<string | null> {
  const tokenCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const authHeader = request.headers.get('authorization');
  const tokenHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const token = tokenCookie || tokenHeader;

  if (token) {
    const payload = await verifyToken(token);
    if (payload?.userId) return String(payload.userId);
  }

  const queryUserId = request.nextUrl.searchParams.get('userId');
  if (queryUserId) return queryUserId;

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ success: true, wishlist: [] });
    }

    await connectDB();
    const user = await User.findById(userId).select('wishlist').lean();
    return NextResponse.json({
      success: true,
      wishlist: Array.isArray(user?.wishlist) ? user.wishlist : [],
    });
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let userId = await getUserId(request);
    if (!userId && body.userId) {
      userId = body.userId;
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized user' },
        { status: 401 }
      );
    }

    const { items } = body;
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'Items must be an array' },
        { status: 400 }
      );
    }

    await connectDB();
    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: { wishlist: items } },
      { new: true, runValidators: true }
    ).select('wishlist');

    return NextResponse.json({
      success: true,
      wishlist: updated?.wishlist || [],
    });
  } catch (error: any) {
    console.error('Error saving wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save wishlist' },
      { status: 500 }
    );
  }
}
