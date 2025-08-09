import { useEffect, useState } from "react";
import API from "../api";
import Header from "../components/Header";
import { toast } from "react-toastify";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    publishDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to fetch categories");
    }
  };

  // Fetch events from API
  const fetchData = async () => {
    try {
      const devMode = "production"; // change as needed
      const resEvents = await API.get(`/events${devMode ? "?showAll=true" : ""}`);
      setEvents(resEvents.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to fetch events");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchData();
  }, []);

  // Format ISO datetime for datetime-local input
  const formatForInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => (n < 10 ? "0" + n : n);
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  // Start editing event
  const startEdit = (ev) => {
    const categoryValue = typeof ev.category === "string" ? ev.category : ev.category?._id || "";
    setForm({
      title: ev.title || "",
      description: ev.description || "",
      category: categoryValue,
      publishDate: formatForInput(ev.publishDate),
    });
    setEditingId(ev._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", description: "", category: "", publishDate: "" });
  };

  // Handle form submission for add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        publishDate: form.publishDate ? new Date(form.publishDate).toISOString() : null,
      };

      if (editingId) {
        await API.put(`/events/${editingId}`, payload);
        toast.success("Event updated successfully");
      } else {
        await API.post("/events", payload);
        toast.success("Event added successfully");
      }

      cancelEdit();
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save event");
      console.error("Error saving event:", err.response?.data || err.message);
    }
  };

  // Handle delete (soft and hard)
  const handleDelete = async (id, hard = false) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      if (hard) {
        await API.delete(`/events/${id}/hard`);
        toast.success("Event hard deleted");
      } else {
        await API.delete(`/events/${id}`);
        toast.success("Event deleted");
      }
      await fetchData();
    } catch (err) {
      toast.error("Failed to delete event");
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  // Filter events by selected category
  const filteredEvents = filterCategory
    ? events.filter((ev) =>
        typeof ev.category === "string"
          ? ev.category === filterCategory
          : ev.category?._id === filterCategory
      )
    : events;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{editingId ? "Edit Event" : "Add Event"}</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 bg-white p-4 rounded-xl shadow"
        >
          <input
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <select
            className="border border-gray-300 rounded-lg p-2 w-full"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            className="border border-gray-300 rounded-lg p-2 w-full"
            value={form.publishDate}
            onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
            required
          />

          <div className="md:col-span-2 lg:col-span-4 flex gap-2 justify-end">
            {editingId && (
              <button type="button" onClick={cancelEdit} className="bg-yellow-400 px-4 py-2 rounded-lg">
                Cancel
              </button>
            )}
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              {editingId ? "Update Event" : "Add Event"}
            </button>
          </div>
        </form>

        {/* Filter */}
        <div className="mb-4 flex items-center gap-4">
          <select
            className="border p-2 rounded-lg"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Event List */}
        <ul className="space-y-4">
          {filteredEvents.map((ev) => (
            <li
              key={ev._id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{ev.title}</h2>
                <p className="text-sm text-gray-500">
                  {typeof ev.category === "string"
                    ? categories.find((c) => c._id === ev.category)?.name || "No Category"
                    : ev.category?.name || "No Category"}
                  {" • "}
                  {new Date(ev.publishDate).toLocaleString()}
                </p>
                <p className="mt-2 text-gray-700">{ev.description}</p>
              </div>

              <div className="mt-4 md:mt-0 flex gap-2">
                <button onClick={() => startEdit(ev)} className="text-blue-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(ev._id)} className="text-red-600 hover:underline">
                  Delete
                </button>
                <button onClick={() => handleDelete(ev._id, true)} className="text-red-800 hover:underline">
                  Hard Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventsPage;
