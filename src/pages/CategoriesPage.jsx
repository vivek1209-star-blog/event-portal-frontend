import { useEffect, useState } from "react";
import API from "../api";
import Header from "../components/Header";
import { toast } from "react-toastify";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [filterParent, setFilterParent] = useState("");

  const fetchData = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/categories/${editingId}`, form);
        toast.success("Category updated successfully");
      } else {
        await API.post("/categories", form);
        toast.success("Category added successfully");
      }
      cancelEdit();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save category");
      console.error("Error saving category:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete category");
      console.error("Error deleting category:", err);
    }
  };

  const startEdit = (cat) => {
    setForm({ name: cat.name });
    setEditingId(cat._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm({ name: "" });
    setEditingId(null);
  };

  const filteredCategories = filterParent
    ? categories.filter((cat) => {
        const parentId =
          typeof cat.parent === "object" && cat.parent !== null
            ? cat.parent._id
            : cat.parent;
        return String(parentId) === String(filterParent);
      })
    : categories;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          {editingId ? "Edit Category" : "Add Category"}
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 bg-white p-4 rounded-xl shadow"
        >
          <input
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <div className="md:col-span-2 lg:col-span-3 flex gap-2 justify-end">
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-yellow-400 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              {editingId ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>

        {/* Filter */}
        <div className="mb-4 flex items-center gap-4">
          <select
            className="border p-2 rounded-lg"
            value={filterParent}
            onChange={(e) => setFilterParent(e.target.value)}
          >
            <option value="">All Parents</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* List */}
        <ul className="space-y-4">
          {filteredCategories.map((cat) => (
            <li
              key={cat._id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{cat.name}</h2>
                {/* Removed parent display */}
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                <button
                  onClick={() => startEdit(cat)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesPage;
