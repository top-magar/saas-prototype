"use client";
import { motion } from 'motion/react';
import { Star, Quote, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    name: "Rajesh Shrestha",
    title: "Owner, Himalayan Traders",
    location: "Kathmandu",
    content: "Pasaal.io transformed our inventory management completely. We went from constant stockouts to optimized inventory levels. Our efficiency increased by 60% in just 3 months.",
    rating: 5,
    results: "60% efficiency increase",
    image: "/logo.svg",
    isVideo: true
  },
  {
    name: "Sita Gurung",
    title: "Manager, Mountain Coffee House",
    location: "Pokhara",
    content: "The customer management features helped us understand our customers better. We've seen a 40% increase in repeat customers since implementing Pasaal.io.",
    rating: 5,
    results: "40% more repeat customers",
    image: "/logo.svg",
    isVideo: false
  },
  {
    name: "Bikash Tamang",
    title: "CEO, Tech Solutions Nepal",
    location: "Lalitpur",
    content: "As a growing tech company, we needed scalable business management. Pasaal.io grew with us from 10 to 50 employees seamlessly.",
    rating: 5,
    results: "Scaled 5x without issues",
    image: "/logo.svg",
    isVideo: true
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            Customer Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Real Results from Real Businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how Nepal businesses are growing faster with Pasaal.io
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative group"
            >
              {/* Video overlay for video testimonials */}
              {testimonial.isVideo && (
                <div className="absolute inset-0 bg-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                  <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <Play className="w-6 h-6" />
                  </div>
                </div>
              )}

              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-primary/20" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-foreground mb-6 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </blockquote>

              {/* Results highlight */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <div className="text-green-800 font-semibold text-sm">
                  📈 {testimonial.results}
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  <div className="text-xs text-muted-foreground">📍 {testimonial.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Join 500+ Successful Businesses
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Start your 14-day free trial today
          </p>
        </motion.div>
      </div>
    </section>
  );
}