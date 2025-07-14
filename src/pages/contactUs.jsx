import React, { useState } from "react";
import { motion } from "framer-motion";

function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-center px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 mb-6 drop-shadow-lg"
      >
        Contact Us
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full max-w-3xl bg-white/80 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8"
      >
        {/* Contact Info */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex-1 flex flex-col justify-between mb-6 md:mb-0"
        >
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-6">
              We'd love to hear from you! Fill out the form or reach us
              directly:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-600">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.5" />
                  <polyline points="17 8 21 12 17 16" />
                </svg>
                <span>info@myabag.com</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 16.92V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.08" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M2 10h20" />
                </svg>
                <span>Sun-Thu: 9am - 6pm</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 16.92V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.08" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M2 10h20" />
                </svg>
                <span>123 Main St, Cairo, Egypt</span>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Contact Form */}
        <motion.form
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex-1 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <label className="block">
            <span className="text-gray-700 font-medium">Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              placeholder="Your Name"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              placeholder="you@email.com"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition resize-none"
              placeholder="Type your message..."
            />
          </label>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg shadow-lg transition-all hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            {loading ? "Sending..." : "Send Message"}
          </motion.button>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 font-semibold mt-2"
            >
              Thank you! Your message has been sent.
            </motion.div>
          )}
        </motion.form>
      </motion.div>
    </div>
  );
}

export default ContactUs;
