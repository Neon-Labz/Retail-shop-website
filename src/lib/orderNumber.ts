import { Counter } from '@/models/Counter';
import { Order } from '@/models/Order';

/**
 * Returns the date in DDMMYY format.
 * Defaults to 'Asia/Colombo' (UTC+5:30) timezone.
 */
export function getOrderDateString(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Colombo',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
    const parts = formatter.formatToParts(date);
    const day = parts.find((p) => p.type === 'day')?.value || String(date.getDate()).padStart(2, '0');
    const month = parts.find((p) => p.type === 'month')?.value || String(date.getMonth() + 1).padStart(2, '0');
    const year = parts.find((p) => p.type === 'year')?.value || String(date.getFullYear()).slice(-2);
    return `${day}${month}${year}`;
  } catch {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = String(date.getFullYear()).slice(-2);
    return `${d}${m}${y}`;
  }
}

/**
 * Generates an atomic sequential order number formatted as ORD-DDMMYY-1001.
 * Sequences sequentially: 1001, 1002, 1003...
 * Uses MongoDB findByIdAndUpdate with $inc to ensure thread-safe atomic sequence generation.
 */
export async function generateNextOrderNumber(date: Date = new Date()): Promise<string> {
  const dateStr = getOrderDateString(date);
  const counterId = `order_${dateStr}`;

  // Check if counter already exists
  const existingCounter = await Counter.findById(counterId).lean();

  if (!existingCounter) {
    // If not existing, check if any orders for this day already exist in Order collection
    const latestOrder = await Order.findOne({
      orderNumber: new RegExp(`^ORD-${dateStr}-(\\d+)$`),
    })
      .sort({ orderNumber: -1 })
      .lean();

    let startingSeq = 1000;
    if (latestOrder?.orderNumber) {
      const match = latestOrder.orderNumber.match(/^ORD-\d{6}-(\d+)$/);
      if (match && match[1]) {
        const parsed = parseInt(match[1], 10);
        if (!isNaN(parsed) && parsed >= 1000) {
          startingSeq = parsed;
        }
      }
    }

    try {
      await Counter.create({ _id: counterId, seq: startingSeq });
    } catch {
      // Counter was created concurrently, ignore error
    }
  }

  // Atomically increment counter
  const counterDoc = await Counter.findByIdAndUpdate(
    counterId,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean();

  if (!counterDoc || counterDoc.seq < 1001) {
    const fixed = await Counter.findByIdAndUpdate(
      counterId,
      { $set: { seq: 1001 } },
      { new: true }
    ).lean();
    return `ORD-${dateStr}-${fixed?.seq || 1001}`;
  }

  return `ORD-${dateStr}-${counterDoc.seq}`;
}
