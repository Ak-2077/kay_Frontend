import type { CartItem } from '@/utils/cart';

export type PurchasedCourse = {
  id: number | string;
  title: string;
  image: string;
  quantity: number;
  purchasedAt: string;
  paymentStatus: 'paid';
  videoUrl: string;
  downloadUrl: string;
};

const PURCHASED_COURSES_KEY = 'purchased_courses';

const isPurchasedCourse = (value: unknown): value is PurchasedCourse => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    (typeof candidate.id === 'number' || typeof candidate.id === 'string') &&
    typeof candidate.title === 'string' &&
    typeof candidate.image === 'string' &&
    typeof candidate.quantity === 'number' &&
    typeof candidate.purchasedAt === 'string' &&
    candidate.paymentStatus === 'paid' &&
    typeof candidate.videoUrl === 'string' &&
    typeof candidate.downloadUrl === 'string'
  );
};

export const getPurchasedCourses = (): PurchasedCourse[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = localStorage.getItem(PURCHASED_COURSES_KEY);
  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isPurchasedCourse);
  } catch {
    return [];
  }
};

export const addPurchasedCoursesFromCart = (items: CartItem[]) => {
  if (typeof window === 'undefined' || items.length === 0) {
    return;
  }

  const existing = getPurchasedCourses();
  const purchasedAt = new Date().toISOString();

  const incoming: PurchasedCourse[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    image: item.image,
    quantity: item.quantity,
    purchasedAt,
    paymentStatus: 'paid',
    videoUrl: '/Showreel_trim.mp4',
    downloadUrl: '/Showreel_trim.mp4',
  }));

  const mergedMap = new Map<string, PurchasedCourse>();
  [...existing, ...incoming].forEach((course) => {
    mergedMap.set(String(course.id), course);
  });

  localStorage.setItem(PURCHASED_COURSES_KEY, JSON.stringify(Array.from(mergedMap.values())));
};
