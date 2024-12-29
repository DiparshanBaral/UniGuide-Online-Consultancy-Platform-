function HomePage() {
  return (
    <div className="font-sans">
      {/* Header Section */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Uniguide: Online Consultancy Platform</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Study Abroad</a></li>
              <li><a href="#" className="hover:underline">Why UniGuide Counsel</a></li>
              <li><a href="#" className="hover:underline">IELTS Training</a></li>
              <li><a href="#" className="hover:underline">Essential Services</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-96" style={{ backgroundImage: "url('./src/Img/HomeBanner.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Search for Universities</button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
