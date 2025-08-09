import Header from "../components/Header";

const HomePage = () => {
  return (
    <div>
      <Header />
      <main className="p-6">
        <h2 className="text-lg font-medium text-gray-700">
          Welcome to the Home Page!
        </h2>
        <p className="text-gray-500 mt-2">
          Use the navigation above to manage events and categories.
        </p>
      </main>
    </div>
  );
};

export default HomePage;
