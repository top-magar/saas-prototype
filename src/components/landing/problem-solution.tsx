"use client";
import { motion } from 'motion/react';
import { AlertTriangle, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';

const problemSolutions = [
  {
    problem: "Manual inventory tracking leads to stockouts and overstocking",
    solution: "Automated inventory management with smart reorder alerts",
    impact: "Reduce inventory costs by 30% and eliminate stockouts",
    icon: AlertTriangle,
    color: "from-red-500 to-orange-500"
  },
  {
    problem: "Scattered customer data across multiple spreadsheets",
    solution: "Centralized customer management with purchase history",
    impact: "Increase customer retention by 40% with better insights",
    icon: CheckCircle,
    color: "from-blue-500 to-cyan-500"
  },
  {
    problem: "Time-consuming manual sales reporting and analysis",
    solution: "Real-time analytics dashboard with automated reports",
    impact: "Save 10+ hours weekly on reporting and analysis",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500"
  }
];

export function ProblemSolution() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            From Business Pain to Business Gain
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how Pasaal.io transforms common business challenges into competitive advantages
          </p>
        </motion.div>

        <div className="grid gap-8 md:gap-12">
          {problemSolutions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8 items-center"
            >
              {/* Problem */}
              <div className="relative">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-3 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-900 mb-2">Current Problem</h3>
                      <p className="text-red-700 text-sm leading-relaxed">{item.problem}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Solution & Impact */}
              <div className="space-y-4">
                {/* Solution */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Pasaal.io Solution</h3>
                      <p className="text-blue-700 text-sm leading-relaxed">{item.solution}</p>
                    </div>
                  </div>
                </div>

                {/* Impact */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Business Impact</h3>
                      <p className="text-green-700 text-sm font-medium leading-relaxed">{item.impact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}