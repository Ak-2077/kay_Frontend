'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/utils/api';

const ADMIN_TOKEN_KEY = 'admin_token';

type CourseRecord = {
  _id: string;
  code: string;
  title: string;
  price: number;
  thumbnail: string;
  videos?: Array<{ title: string; url: string }>;
};

type UpcomingCourseRecord = {
  _id: string;
  title: string;
  image: string;
  status: string;
  sortOrder: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [upcomingCourses, setUpcomingCourses] = useState<UpcomingCourseRecord[]>([]);

  const [courseForm, setCourseForm] = useState({
    code: '',
    title: '',
    description: '',
    price: '',
    oldPrice: '',
    thumbnail: '',
    status: 'active' as 'active' | 'inactive' | 'draft',
    vimeoTitle: '',
    vimeoUrl: '',
  });

  const [upcomingForm, setUpcomingForm] = useState({
    title: '',
    level: '1',
    episode: 'one',
    courseType: 'COURSE / GEN AI ADVERTISING',
    audio: 'HINDI + ENG CC',
    status: 'NEW EPISODE | OUT NOW',
    image: '',
    sortOrder: '0',
  });

  const [extraVideo, setExtraVideo] = useState({
    courseId: '',
    title: '',
    url: '',
  });

  const loadData = async (adminToken: string) => {
    try {
      setError('');

      const [coursesResponse, upcomingResponse] = await Promise.all([
        adminAPI.getCourses(),
        adminAPI.getUpcomingCoursesAdmin(adminToken),
      ]);

      setCourses(Array.isArray(coursesResponse) ? coursesResponse : []);
      setUpcomingCourses(Array.isArray(upcomingResponse?.courses) ? upcomingResponse.courses : []);
    } catch {
      setError('Unable to load admin data.');
    }
  };

  useEffect(() => {
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (!adminToken) {
      router.push('/admin/login');
      return;
    }

    setToken(adminToken);
    loadData(adminToken).finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    router.push('/admin/login');
  };

  const handleCreateCourse = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;

    setError('');

    const payload = {
      code: courseForm.code.trim(),
      title: courseForm.title.trim(),
      description: courseForm.description.trim(),
      price: Number(courseForm.price),
      oldPrice: courseForm.oldPrice ? Number(courseForm.oldPrice) : undefined,
      thumbnail: courseForm.thumbnail.trim(),
      status: courseForm.status,
      videos: courseForm.vimeoUrl.trim()
        ? [
            {
              title: courseForm.vimeoTitle.trim() || 'Lesson 1',
              url: courseForm.vimeoUrl.trim(),
            },
          ]
        : [],
    };

    const response = await adminAPI.createCourse(token, payload);

    if (response?._id || response?.message?.toLowerCase().includes('created')) {
      setCourseForm({
        code: '',
        title: '',
        description: '',
        price: '',
        oldPrice: '',
        thumbnail: '',
        status: 'active',
        vimeoTitle: '',
        vimeoUrl: '',
      });
      await loadData(token);
      return;
    }

    setError(response?.message || 'Failed to create course.');
  };

  const handleCreateUpcomingCourse = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;

    setError('');

    const response = await adminAPI.createUpcomingCourse(token, {
      title: upcomingForm.title.trim(),
      level: upcomingForm.level.trim(),
      episode: upcomingForm.episode.trim(),
      courseType: upcomingForm.courseType.trim(),
      audio: upcomingForm.audio.trim(),
      status: upcomingForm.status.trim(),
      image: upcomingForm.image.trim(),
      sortOrder: Number(upcomingForm.sortOrder) || 0,
      active: true,
    });

    if (response?.course?._id || response?.message?.toLowerCase().includes('created')) {
      setUpcomingForm({
        title: '',
        level: '1',
        episode: 'one',
        courseType: 'COURSE / GEN AI ADVERTISING',
        audio: 'HINDI + ENG CC',
        status: 'NEW EPISODE | OUT NOW',
        image: '',
        sortOrder: '0',
      });
      await loadData(token);
      return;
    }

    setError(response?.message || 'Failed to create upcoming course.');
  };

  const handleDeleteUpcoming = async (id: string) => {
    if (!token) return;

    const response = await adminAPI.deleteUpcomingCourse(token, id);
    if (response?.message?.toLowerCase().includes('deleted')) {
      await loadData(token);
      return;
    }

    setError(response?.message || 'Failed to delete upcoming course.');
  };

  const handleAddVideoToCourse = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;

    if (!extraVideo.courseId || !extraVideo.url.trim() || !extraVideo.title.trim()) {
      setError('Select course and provide video title + Vimeo URL.');
      return;
    }

    const response = await adminAPI.addCourseVideo(token, extraVideo.courseId, {
      title: extraVideo.title.trim(),
      url: extraVideo.url.trim(),
    });

    if (response?._id || response?.message?.toLowerCase().includes('updated')) {
      setExtraVideo({ courseId: '', title: '', url: '' });
      await loadData(token);
      return;
    }

    setError(response?.message || 'Failed to add video to course.');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f3f3] px-4 py-10 text-sm text-black/70">
        Loading admin dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-medium text-black md:text-3xl">Admin Portal</h1>
            <p className="mt-1 text-sm text-black/70">Manage courses, Vimeo lesson URLs, and upcoming courses.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-black px-4 py-2 text-sm font-medium uppercase text-black transition hover:bg-black hover:text-white"
          >
            Logout
          </button>
        </div>

        {error && <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

        <section className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={handleCreateCourse} className="rounded-2xl border border-black/10 bg-white p-5 space-y-3">
            <h2 className="text-xl font-medium text-black">Add New Course</h2>
            <input value={courseForm.code} onChange={(e) => setCourseForm((p) => ({ ...p, code: e.target.value }))} placeholder="Course code (unique)" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" required />
            <input value={courseForm.title} onChange={(e) => setCourseForm((p) => ({ ...p, title: e.target.value }))} placeholder="Course title" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" required />
            <textarea value={courseForm.description} onChange={(e) => setCourseForm((p) => ({ ...p, description: e.target.value }))} placeholder="Course description" className="w-full min-h-20 rounded-lg border border-black/20 px-3 py-2.5 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={courseForm.price} onChange={(e) => setCourseForm((p) => ({ ...p, price: e.target.value }))} placeholder="Price" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" required />
              <input type="number" value={courseForm.oldPrice} onChange={(e) => setCourseForm((p) => ({ ...p, oldPrice: e.target.value }))} placeholder="Old Price (optional)" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" />
            </div>
            <input value={courseForm.thumbnail} onChange={(e) => setCourseForm((p) => ({ ...p, thumbnail: e.target.value }))} placeholder="Thumbnail URL" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" required />
            <select value={courseForm.status} onChange={(e) => setCourseForm((p) => ({ ...p, status: e.target.value as 'active' | 'inactive' | 'draft' }))} className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm">
              <option value="active">active</option>
              <option value="inactive">inactive</option>
              <option value="draft">draft</option>
            </select>
            <input value={courseForm.vimeoTitle} onChange={(e) => setCourseForm((p) => ({ ...p, vimeoTitle: e.target.value }))} placeholder="First Vimeo lesson title (optional)" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" />
            <input value={courseForm.vimeoUrl} onChange={(e) => setCourseForm((p) => ({ ...p, vimeoUrl: e.target.value }))} placeholder="First Vimeo lesson URL (optional)" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" />
            <button type="submit" className="w-full rounded-xl bg-black px-5 py-3 text-sm font-medium uppercase text-white transition hover:bg-black/80">Create Course</button>
          </form>

          <form onSubmit={handleCreateUpcomingCourse} className="rounded-2xl border border-black/10 bg-white p-5 space-y-3">
            <h2 className="text-xl font-medium text-black">Add Upcoming Course</h2>
            <input value={upcomingForm.title} onChange={(e) => setUpcomingForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" required />
            <div className="grid grid-cols-2 gap-3">
              <input value={upcomingForm.level} onChange={(e) => setUpcomingForm((p) => ({ ...p, level: e.target.value }))} placeholder="Level" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" />
              <input value={upcomingForm.episode} onChange={(e) => setUpcomingForm((p) => ({ ...p, episode: e.target.value }))} placeholder="Episode" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" />
            </div>
            <input value={upcomingForm.courseType} onChange={(e) => setUpcomingForm((p) => ({ ...p, courseType: e.target.value }))} placeholder="Course type" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" />
            <input value={upcomingForm.audio} onChange={(e) => setUpcomingForm((p) => ({ ...p, audio: e.target.value }))} placeholder="Audio" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" />
            <input value={upcomingForm.status} onChange={(e) => setUpcomingForm((p) => ({ ...p, status: e.target.value }))} placeholder="Status text" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" />
            <input value={upcomingForm.image} onChange={(e) => setUpcomingForm((p) => ({ ...p, image: e.target.value }))} placeholder="Image URL" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" required />
            <input type="number" value={upcomingForm.sortOrder} onChange={(e) => setUpcomingForm((p) => ({ ...p, sortOrder: e.target.value }))} placeholder="Sort order" className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm" />
            <button type="submit" className="w-full rounded-xl bg-black px-5 py-3 text-sm font-medium uppercase text-white transition hover:bg-black/80">Create Upcoming Course</button>
          </form>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-5 space-y-3">
          <h2 className="text-xl font-medium text-black">Add Vimeo Lesson to Existing Course</h2>
          <form onSubmit={handleAddVideoToCourse} className="grid gap-3 md:grid-cols-4">
            <select value={extraVideo.courseId} onChange={(e) => setExtraVideo((p) => ({ ...p, courseId: e.target.value }))} className="rounded-lg border border-black/20 px-3 py-2.5 text-sm" required>
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
            <input value={extraVideo.title} onChange={(e) => setExtraVideo((p) => ({ ...p, title: e.target.value }))} placeholder="Lesson title" className="rounded-lg border border-black/20 px-3 py-2.5 text-sm" required />
            <input value={extraVideo.url} onChange={(e) => setExtraVideo((p) => ({ ...p, url: e.target.value }))} placeholder="Vimeo URL" className="rounded-lg border border-black/20 px-3 py-2.5 text-sm" required />
            <button type="submit" className="rounded-xl bg-black px-5 py-3 text-sm font-medium uppercase text-white transition hover:bg-black/80">Add Video</button>
          </form>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h2 className="mb-3 text-xl font-medium text-black">Courses ({courses.length})</h2>
            <div className="space-y-2 text-sm">
              {courses.length === 0 ? (
                <p className="text-black/60">No courses found.</p>
              ) : (
                courses.map((course) => (
                  <div key={course._id} className="rounded-lg border border-black/10 px-3 py-2">
                    <p className="font-medium text-black">{course.title}</p>
                    <p className="text-black/70">Code: {course.code} • Price: ₹{course.price}</p>
                    <p className="text-black/60">Videos: {course.videos?.length || 0}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h2 className="mb-3 text-xl font-medium text-black">Upcoming Courses ({upcomingCourses.length})</h2>
            <div className="space-y-2 text-sm">
              {upcomingCourses.length === 0 ? (
                <p className="text-black/60">No upcoming courses found.</p>
              ) : (
                upcomingCourses.map((course) => (
                  <div key={course._id} className="flex items-center justify-between rounded-lg border border-black/10 px-3 py-2">
                    <div>
                      <p className="font-medium text-black">{course.title}</p>
                      <p className="text-black/70">Status: {course.status}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteUpcoming(course._id)}
                      className="rounded border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
