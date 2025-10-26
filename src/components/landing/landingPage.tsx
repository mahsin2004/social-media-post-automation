'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function landingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-pink-100 text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-24 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold mb-4 text-gray-900"
        >
          Create & Publish AI-Powered Posts — <span className="text-pink-600">in 1 Click</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8"
        >
          1ClikPost helps you generate trending, engaging content with AI and instantly publish it across all your social platforms.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            size="lg" 
            className="bg-pink-600 hover:bg-pink-700 text-white text-lg px-8 py-6 rounded-full"
            onClick={() => window.location.href = '/dashboard'}
          >
            Try Free Now
          </Button>
          <Button 
            size="lg" 
            className="bg-white hover:bg-gray-100 text-pink-600 border border-pink-600 text-lg px-8 py-6 rounded-full"
            onClick={() => window.location.href = '/dashboard'}
          >
            Get Started Now
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 px-6 md:px-20 py-20">
        {[
          {
            title: "AI Post Generator",
            desc: "Craft titles, captions, hashtags, and images with a single click.",
          },
          {
            title: "Smart Trend Detection",
            desc: "Choose trending topics or categories like tech, art, or entertainment.",
          },
          {
            title: "1-Click Publish",
            desc: "Post your content instantly across Facebook, Instagram, Twitter, and more.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-pink-200 transition">
              <CardContent className="p-8 text-center">
                <Sparkles className="mx-auto mb-4 text-pink-600" size={36} />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* About Section */}
      <section className="text-center py-24 px-6 bg-white/60 backdrop-blur-md">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Why Choose 1ClikPost?
        </motion.h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          1ClikPost makes content creation simple, fast, and effective. Whether you’re a creator, marketer, or business, our AI tools help you craft, customize, and publish your posts seamlessly — saving hours every week.
        </p>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 px-4 bg-gradient-to-r from-pink-500 to-pink-700 text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Simplify Your Social Media?</h2>
        <p className="text-lg mb-8 opacity-90">Start generating and publishing posts effortlessly with AI.</p>
        <Button size="lg" variant="secondary" className="text-pink-600 font-semibold px-8 py-6 rounded-full">
          Get Started Now
        </Button>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-sm bg-white/50">
        © {new Date().getFullYear()} 1ClikPost. All rights reserved.
      </footer>
    </div>
  );
}
