import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e4d1d4] to-[#caa0a2] text-gray-800">
      {/* Hero Section */}
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-8xl mb-8 block">👜</span>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-[#caa0a2] leading-tight">
              Welcome to MyABag
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Where Style Meets Functionality
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-[#caa0a2]">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Born from a passion for fashion and functionality, MyABag brings
                you the perfect blend of style and practicality. We believe
                every bag tells a story, and we're here to help you tell yours.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#caa0a2] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Learn More
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="border-2 border-[#caa0a2] text-[#caa0a2] px-6 py-3 rounded-full hover:bg-[#caa0a2]/10 transition-all"
                >
                  Contact Us
                </motion.button>
              </div>
            </div>
            <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🎯</div>
                  <h3 className="text-2xl font-semibold text-[#caa0a2]">
                    Our Vision
                  </h3>
                </div>
                <p className="text-gray-700">
                  To provide a seamless and enjoyable shopping experience while
                  ensuring the highest quality products and customer
                  satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#caa0a2] mb-16">
            Why Choose MyABag?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚚",
                title: "Fast Delivery",
                desc: "Quick and reliable shipping to your doorstep",
              },
              {
                icon: "🛡️",
                title: "Secure Shopping",
                desc: "Safe and protected transactions every time",
              },
              {
                icon: "💎",
                title: "Quality Products",
                desc: "Curated selection of premium items",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/30 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-[#caa0a2]">
                  {feature.title}
                </h3>
                <p className="text-gray-700">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💡",
                title: "Innovation",
                desc: "Constantly evolving to bring you the latest trends",
              },
              {
                icon: "🌟",
                title: "Quality",
                desc: "Uncompromising standards in every product",
              },
              {
                icon: "❤️",
                title: "Customer First",
                desc: "Your satisfaction is our top priority",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/30 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-6">{value.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-[#caa0a2]">
                  {value.title}
                </h3>
                <p className="text-gray-700">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-white/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#caa0a2]">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl text-gray-700">
              Discover our collection of premium bags and accessories
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-[#caa0a2] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Shop Now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
