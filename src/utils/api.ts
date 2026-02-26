const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (token: string) => ({
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

  placeOrder: async (
    token: string,
    payload: {
      name?: string;
      email?: string;
      billingAddress: string;
      whatsapp: string;
      paymentType: 'india' | 'international';
    }
  ) => {
    const res = await fetch(`${API_URL}/api/orders/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
