import type { Course } from '@/data/courses';
import { cartAPI } from '@/utils/api';

export type CartItem = Course & {
  quantity: number;
};

const CART_STORAGE_KEY = 'checkout_cart';
export const CART_UPDATED_EVENT = 'cart:updated';

const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('token');
};

const shouldUseBackendCart = () => {
  return Boolean(getAuthToken() && process.env.NEXT_PUBLIC_API_URL);
};

const parseStoredJson = (key: string): unknown => {
  const rawValue = localStorage.getItem(key);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
};

const isCourse = (value: unknown): value is Course => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    (typeof candidate.id === 'number' || typeof candidate.id === 'string') &&
    typeof candidate.title === 'string' &&
    typeof candidate.oldPrice === 'string' &&
    typeof candidate.newPrice === 'string' &&
    typeof candidate.status === 'string' &&
    typeof candidate.image === 'string'
  );
};

const isCartItem = (value: unknown): value is CartItem => {
  if (!isCourse(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.quantity === 'number' && candidate.quantity > 0;
};

const mapBackendItemsToCart = (items: unknown): CartItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const candidate = item as Record<string, unknown>;
      const courseIdRaw = candidate.courseId;
      const normalizedCourseId =
        typeof courseIdRaw === 'number'
          ? courseIdRaw
          : typeof courseIdRaw === 'string' && courseIdRaw.trim() !== ''
            ? courseIdRaw
            : null;

      if (
        normalizedCourseId === null ||
        typeof candidate.title !== 'string' ||
        typeof candidate.oldPrice !== 'string' ||
        typeof candidate.newPrice !== 'string' ||
        typeof candidate.status !== 'string' ||
        typeof candidate.image !== 'string' ||
        typeof candidate.quantity !== 'number'
      ) {
        return null;
      }

      return {
        id: normalizedCourseId,
        title: candidate.title,
        oldPrice: candidate.oldPrice,
        newPrice: candidate.newPrice,
        status: candidate.status,
        image: candidate.image,
        quantity: candidate.quantity,
      } as CartItem;
    })
    .filter((item): item is CartItem => Boolean(item));
};

export const setStoredCart = (cartItems: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  localStorage.removeItem('checkout_course');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
};

const getLocalStoredCart = (): CartItem[] => {
  const parsedCart = parseStoredJson(CART_STORAGE_KEY);

  if (Array.isArray(parsedCart)) {
    const validCart = parsedCart.filter(isCartItem);
    return validCart;
  }

  return [];
};

export const fetchCart = async (): Promise<CartItem[]> => {
  const localCart = getLocalStoredCart();
  const token = getAuthToken();

  if (!token || !shouldUseBackendCart()) {
    return localCart;
  }

  try {
    const backendCart = await cartAPI.getCart(token);
    const mappedItems = mapBackendItemsToCart(backendCart?.items);

    setStoredCart(mappedItems);
    return mappedItems;
  } catch {
    setStoredCart([]);
    return [];
  }
};

export const addCourseToCart = async (course: Course): Promise<CartItem[]> => {
  const token = getAuthToken();

  if (token && shouldUseBackendCart()) {
    try {
      const response = await cartAPI.addItem(token, course);
      const mappedItems = mapBackendItemsToCart(response?.items);
      setStoredCart(mappedItems);
      return mappedItems;
    } catch {
      return fetchCart();
    }
  }

  const localCart = getLocalStoredCart();
  const existingItem = localCart.find((item) => String(item.id) === String(course.id));
  const updatedCart = existingItem
    ? localCart.map((item) =>
        String(item.id) === String(course.id) ? { ...item, quantity: item.quantity + 1 } : item
      )
    : [...localCart, { ...course, quantity: 1 }];
  setStoredCart(updatedCart);
  return updatedCart;
};

export const removeCourseFromCart = async (courseId: string | number): Promise<CartItem[]> => {
  const token = getAuthToken();

  if (token && shouldUseBackendCart()) {
    try {
      const response = await cartAPI.removeItem(token, courseId);
      const mappedItems = mapBackendItemsToCart(response?.items);
      setStoredCart(mappedItems);
      return mappedItems;
    } catch {
      return fetchCart();
    }
  }

  const updatedCart = getLocalStoredCart().filter((item) => String(item.id) !== String(courseId));
  setStoredCart(updatedCart);
  return updatedCart;
};

export const decrementCourseQuantity = async (courseId: string | number): Promise<CartItem[]> => {
  const token = getAuthToken();

  if (token && shouldUseBackendCart()) {
    try {
      const response = await cartAPI.decrementItem(token, courseId);
      const mappedItems = mapBackendItemsToCart(response?.items);
      setStoredCart(mappedItems);
      return mappedItems;
    } catch {
      return fetchCart();
    }
  }

  const updatedCart = getLocalStoredCart()
    .map((item) => (String(item.id) === String(courseId) ? { ...item, quantity: item.quantity - 1 } : item))
    .filter((item) => item.quantity > 0);
  setStoredCart(updatedCart);
  return updatedCart;
};

export const clearCartCompletely = async (): Promise<CartItem[]> => {
  const token = getAuthToken();

  if (token && shouldUseBackendCart()) {
    try {
      const response = await cartAPI.clearCart(token);
      const mappedItems = mapBackendItemsToCart(response?.items);
      setStoredCart(mappedItems);
      return mappedItems;
    } catch {
      setStoredCart([]);
      return [];
    }
  }

  setStoredCart([]);
  return [];
};

export const getCartItemCount = async () => {
  const items = await fetchCart();
  return items.reduce((count, item) => count + item.quantity, 0);
};