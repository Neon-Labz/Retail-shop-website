import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const slug = searchParams.get('slug') || searchParams.get('productSlug');
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '30')));

    await connectDB();

    const query: Record<string, any> = {
      status: 'approved',
    };

    if (productId || slug) {
      const orConditions: any[] = [];
      if (productId) orConditions.push({ productId });
      if (slug) orConditions.push({ productSlug: slug });
      query.$or = orConditions;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    const formattedReviews = reviews.map((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      starCounts[star] = (starCounts[star] || 0) + 1;

      return {
        id: r._id.toString(),
        productId: r.productId || '',
        productSlug: r.productSlug || '',
        productName: r.productName || '',
        author: r.author,
        rating: r.rating,
        date: new Date(r.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        title: r.title || '',
        body: r.body,
        images: Array.isArray(r.images) ? r.images : [],
        likes: r.likes || 0,
        verified: r.verified ?? true,
        avatar: r.avatar || '',
        createdAt: r.createdAt,
      };
    });

    const totalCount = formattedReviews.length;
    const averageRating =
      totalCount > 0
        ? Number((formattedReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1))
        : 5;

    return NextResponse.json({
      success: true,
      count: totalCount,
      averageRating,
      starCounts,
      reviews: formattedReviews,
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, reviewId } = body;

    await connectDB();

    if (action === 'like' && reviewId) {
      const updated = await Review.findByIdAndUpdate(
        reviewId,
        { $inc: { likes: 1 } },
        { new: true }
      );
      return NextResponse.json({ success: true, likes: updated?.likes || 1 });
    }

    const { productId, productSlug, productName, author, email, rating, title, comment, images } = body;

    if (!author || typeof author !== 'string' || !author.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return NextResponse.json(
        { success: false, error: 'Review message is required' },
        { status: 400 }
      );
    }

    const numericRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const newReview = await Review.create({
      productId: productId ? String(productId).trim() : '',
      productSlug: productSlug ? String(productSlug).trim() : '',
      productName: productName ? String(productName).trim() : '',
      author: author.trim(),
      email: email ? String(email).trim().toLowerCase() : '',
      rating: numericRating,
      title: title ? String(title).trim() : '',
      body: comment.trim(),
      images: Array.isArray(images) ? images : [],
      likes: 0,
      verified: true,
      status: 'approved',
    });

    return NextResponse.json({
      success: true,
      message: 'Review created successfully!',
      review: {
        id: newReview._id.toString(),
        productId: newReview.productId,
        productSlug: newReview.productSlug,
        productName: newReview.productName,
        author: newReview.author,
        rating: newReview.rating,
        date: new Date(newReview.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        title: newReview.title,
        body: newReview.body,
        images: newReview.images || [],
        likes: 0,
        verified: newReview.verified,
        createdAt: newReview.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/reviews POST:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}
