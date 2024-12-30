function HomePage() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: "url('./src/Img/HomePageBanner.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Begin Your Education Dream</h2>
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
              Search for Universities
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
