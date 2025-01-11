function ContactUs() {
    return (
      <div className="px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-white text-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">
              Have questions, feedback, or need assistance? We’re here to help. Fill out the form below or reach out to us directly.
            </p>
          </header>
  
          {/* Contact Form Section */}
          <section className="mb-12">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-3xl mx-auto">
              <form className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-800"
                    required
                  />
                </div>
  
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-800"
                    required
                  />
                </div>
  
                {/* Queries/Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Queries
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Type your queries or feedback here..."
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-800"
                    required
                  ></textarea>
                </div>
  
                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-gray-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 transition duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </section>
  
          {/* Contact Information Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Other Ways to Contact Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Email Contact */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Us</h3>
                <p className="text-gray-700">
                  Reach us via email for any inquiries:
                </p>
                <p className="text-blue-600 font-medium mt-2">support@uniguide.com</p>
              </div>
  
              {/* Phone Contact */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Us</h3>
                <p className="text-gray-700">
                  Speak to our support team directly:
                </p>
                <p className="text-blue-600 font-medium mt-2">+977 9818601909</p>
              </div>
  
              {/* Office Address */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Us</h3>
                <p className="text-gray-700">
                  Drop by our office for in-person assistance:
                </p>
                <p className="text-blue-600 font-medium mt-2">P86J+W8X, Kathmandu 44600</p>
              </div>
            </div>
          </section>
  
          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <ul className="list-disc list-inside space-y-4 text-gray-700">
              <li>
                <a href="/faq" className="text-blue-600 hover:underline">
                  How do I create an account?
                </a>
              </li>
              <li>
                <a href="/help" className="text-blue-600 hover:underline">
                  What services does UniGuide offer?
                </a>
              </li>
              <li>
                <a href="/support" className="text-blue-600 hover:underline">
                  How do I contact a mentor?
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-blue-600 hover:underline">
                  What is your privacy policy?
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    );
  }
  
  export default ContactUs;
  