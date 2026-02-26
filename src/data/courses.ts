export type Course = {
  id: number;
  title: string;
  oldPrice: string;
  newPrice: string;
  status: string;
  image: string;
};

export const newCourses: Course[] = [
  {
    id: 1,
    title: 'MARKETING FOR CREATIVE',
    oldPrice: '₹12,000',
    newPrice: '₹8,000',
    status: 'Upcoming',
    image:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'PHOTOGRAPHY MASTERCLASS',
    oldPrice: '₹9,000',
    newPrice: '₹4,500',
    status: 'Upcoming',
    image: '/Photography.png',
  },
  {
    id: 3,
    title: 'PITCH DECKS MASTER CLASS',
    oldPrice: '₹6,000',
    newPrice: '₹1,999',
    status: 'Upcoming',
    image:
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop',
  },
];