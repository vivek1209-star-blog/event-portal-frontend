import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <h1
        onClick={() => navigate("/home")}
        className="text-xl font-semibold text-gray-800 cursor-pointer"
      >
        Event Dashboard
      </h1>
      <nav className="space-x-4">
        <button
          onClick={() => navigate("/events")}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Events
        </button>
        <button
          onClick={() => navigate("/categories")}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Categories
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-medium px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
