const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

const getAdminHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const authAPI = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  login: async (data: { email: string; password: string }) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  googleLogin: async (data: { credential: string }) => {
    const res = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getMe: async (token: string) => {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  updateProfile: async (token: string, data: { name: string; email: string }) => {
    const res = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  changePassword: async (token: string, data: { currentPassword: string; newPassword: string }) => {
    const res = await fetch(`${API_URL}/api/auth/password`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteAccount: async (token: string) => {
    const res = await fetch(`${API_URL}/api/auth/account`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.json();
  },
};

export const cartAPI = {
  getCart: async (token: string) => {
    const res = await fetch(`${API_URL}/api/cart`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return res.json();
  },

  addItem: async (
    token: string,
    course: { id: number; title: string; oldPrice: string; newPrice: string; status: string; image: string }
  ) => {
    const res = await fetch(`${API_URL}/api/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ course }),
    });
    return res.json();
  },

  decrementItem: async (token: string, courseId: number) => {
    const res = await fetch(`${API_URL}/api/cart/decrement`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ courseId }),
    });
    return res.json();
  },

  removeItem: async (token: string, courseId: number) => {
    const res = await fetch(`${API_URL}/api/cart/item/${courseId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.json();
  },

  clearCart: async (token: string) => {
    const res = await fetch(`${API_URL}/api/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.json();
  },

  syncCart: async (
    token: string,
    items: Array<{
      courseId: number;
      title: string;
      oldPrice: string;
      newPrice: string;
      status: string;
      image: string;
      quantity: number;
    }>
  ) => {
    const res = await fetch(`${API_URL}/api/cart/sync`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ items }),
    });
    return res.json();
  },
};

export const orderAPI = {
  getMyCourseAccess: async (token: string) => {
    const res = await fetch(`${API_URL}/api/orders/access`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return res.json();
  },

  getMyOrders: async (token: string) => {
    const res = await fetch(`${API_URL}/api/orders/my`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return res.json();
  },

  createCheckoutOrder: async (
    token: string,
    payload: {
      name?: string;
      email?: string;
      billingAddress: string;
      whatsapp: string;
      paymentType: 'india' | 'international';
    },
    idempotencyKey: string
  ) => {
    const res = await fetch(`${API_URL}/api/orders/checkout/create`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(token),
        'x-idempotency-key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  verifyCheckoutPayment: async (
    token: string,
    payload: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }
  ) => {
    const res = await fetch(`${API_URL}/api/orders/checkout/verify`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};

export const adminAPI = {
  login: async (data: { username: string; password: string }) => {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getCourses: async () => {
    const res = await fetch(`${API_URL}/api/courses`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  createCourse: async (
    token: string,
    data: {
      code: string;
      title: string;
      description?: string;
      price: number;
      oldPrice?: number;
      thumbnail: string;
      status?: 'active' | 'inactive' | 'draft';
      videos?: Array<{ title: string; url: string; duration?: number; description?: string }>;
    }
  ) => {
    const res = await fetch(`${API_URL}/api/courses`, {
      method: 'POST',
      headers: getAdminHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  addCourseVideo: async (
    token: string,
    courseId: string,
    data: { title: string; url: string; duration?: number; description?: string }
  ) => {
    const res = await fetch(`${API_URL}/api/courses/${courseId}/videos`, {
      method: 'POST',
      headers: getAdminHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getUpcomingCoursesAdmin: async (token: string) => {
    const res = await fetch(`${API_URL}/api/upcoming-courses/admin`, {
      method: 'GET',
      headers: getAdminHeaders(token),
    });
    return res.json();
  },

  createUpcomingCourse: async (
    token: string,
    data: {
      title: string;
      level?: string;
      episode?: string;
      courseType?: string;
      audio?: string;
      status?: string;
      image: string;
      active?: boolean;
      sortOrder?: number;
    }
  ) => {
    const res = await fetch(`${API_URL}/api/upcoming-courses/admin`, {
      method: 'POST',
      headers: getAdminHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteUpcomingCourse: async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/api/upcoming-courses/admin/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(token),
    });
    return res.json();
  },
};
