import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';
import { useSplashNavigation } from '../components/SplashRouter';

export const SplashPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { navigateToMainApp } = useSplashNavigation();

  // Particle system initialization
  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  // Scroll-based transforms for various elements
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const wireframeProgress = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const forgeProgress = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);

  return (
    <div ref={containerRef} className="relative min-h-[500vh] bg-gray-900 overflow-hidden">
      {/* Particle Background */}
      <div className="fixed inset-0 z-0">
        <Particles
          id="splash-particles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: false,
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: ["#3B82F6", "#10B981", "#F59E0B"],
              },
              links: {
                color: "#3B82F6",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.3,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      {/* Section 1: Hero Introduction */}
      <motion.section 
        className="relative z-10 h-screen flex items-center justify-center"
        style={{ opacity: heroOpacity }}
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-8xl font-bold text-white mb-4">
              <span className="text-white">DROID</span>
              <span className="text-orange-500">FORG</span>
              <span className="text-blue-400">3D</span>
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 1.5 }}
              className="h-1 bg-gradient-to-r from-blue-400 via-orange-500 to-green-400 mx-auto"
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Where artificial intelligence meets precision manufacturing.
            <br />
            <span className="text-blue-400">Droid</span> generates stunning models with AI, 
            while <span className="text-orange-500">Forge</span> brings them to life with precision 3D printing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 3 }}
            className="mt-12"
          >
            <div className="text-gray-400 text-lg mb-4">Scroll to explore</div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-400 rounded-full mx-auto relative"
            >
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-gray-400 rounded-full absolute left-1/2 top-2 transform -translate-x-1/2"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 2: The "Droid" - AI Model Generation */}
      <DroidSection wireframeProgress={wireframeProgress} />

      {/* Section 3: The "Forge" - Precision 3D Printing */}
      <ForgeSection forgeProgress={forgeProgress} />

      {/* Section 4: Showcasing Possibilities */}
      <ShowcaseSection />

      {/* Section 5: Call to Action */}
      <CTASection navigateToMainApp={navigateToMainApp} />
    </div>
  );
};

// Droid Section Component
const DroidSection: React.FC<{ wireframeProgress: any }> = ({ wireframeProgress }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative z-10 h-screen flex items-center px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h2 className="text-6xl font-bold text-white mb-6">
            Meet <span className="text-blue-400">Droid</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            Our advanced AI system analyzes your concepts and generates intricate 3D models 
            with unprecedented detail and creativity. From simple sketches to complex engineering 
            specifications, Droid transforms your ideas into printable reality.
          </p>
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center space-x-3"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">AI-powered design generation</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">Complex geometry optimization</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center space-x-3"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">Instant design iterations</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="relative h-96">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: wireframeProgress }}
          >
            <WireframeModel progress={wireframeProgress} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Wireframe Model Component
const WireframeModel: React.FC<{ progress: any }> = ({ progress }) => {
  return (
    <motion.svg
      width="400"
      height="300"
      viewBox="0 0 400 300"
      className="text-blue-400"
      style={{ opacity: progress }}
    >
      {/* Wireframe lines that draw progressively */}
      <motion.path
        d="M50 250 L200 50 L350 250 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      <motion.path
        d="M50 250 L200 150 L350 250"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      />
      <motion.path
        d="M125 200 L200 50 L275 200"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />
      
      {/* Glowing nodes */}
      <motion.circle
        cx="200"
        cy="50"
        r="4"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
        className="drop-shadow-lg"
      />
      <motion.circle
        cx="50"
        cy="250"
        r="4"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 2.2 }}
        className="drop-shadow-lg"
      />
      <motion.circle
        cx="350"
        cy="250"
        r="4"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 2.4 }}
        className="drop-shadow-lg"
      />
    </motion.svg>
  );
};

// Forge Section Component
const ForgeSection: React.FC<{ forgeProgress: any }> = ({ forgeProgress }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative z-10 h-screen flex items-center px-8 bg-gray-800/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-96 order-2 lg:order-1">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: forgeProgress }}
          >
            <PrintingAnimation progress={forgeProgress} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
          className="order-1 lg:order-2"
        >
          <h2 className="text-6xl font-bold text-white mb-6">
            Meet <span className="text-orange-500">Forge</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            Precision 3D printing technology that transforms digital dreams into physical reality. 
            Our advanced manufacturing processes ensure every detail is captured with 
            microscopic accuracy and professional-grade quality.
          </p>
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center space-x-3"
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-300">Micron-level precision</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-300">Premium material selection</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center space-x-3"
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-300">Real-time quality monitoring</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Printing Animation Component
const PrintingAnimation: React.FC<{ progress: any }> = ({ progress }) => {
  return (
    <motion.div
      className="relative w-80 h-60"
      style={{ opacity: progress }}
    >
      {/* Printer base */}
      <div className="absolute bottom-0 w-full h-8 bg-gray-700 rounded"></div>
      
      {/* Build platform */}
      <div className="absolute bottom-8 w-full h-4 bg-gray-600 rounded"></div>
      
      {/* Object being printed (layer by layer) */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-t from-orange-500 to-orange-300 rounded"
        initial={{ height: 0 }}
        animate={{ height: 128 }}
        transition={{ duration: 3, delay: 1 }}
      />
      
      {/* Printer nozzle */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gray-500 rounded-b"
        animate={{ y: [20, 140, 20] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Laser effect */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-orange-400 opacity-80"
        style={{ height: "20px" }}
        animate={{ 
          y: [26, 146, 26],
          opacity: [0.8, 0.8, 0.8]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

// Showcase Section Component
const ShowcaseSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const showcaseItems = [
    { title: "Architectural Model", description: "Complex geometric structures", color: "blue" },
    { title: "Artistic Sculpture", description: "Organic flowing forms", color: "green" },
    { title: "Mechanical Part", description: "Precision engineering", color: "orange" },
  ];

  return (
    <section ref={ref} className="relative z-10 h-screen flex items-center px-8">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-6xl font-bold text-white mb-12"
        >
          Endless <span className="text-green-400">Possibilities</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group cursor-pointer"
            >
              <div className={`h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 hover:border-${item.color}-400 transition-all duration-300 group-hover:scale-105`}>
                <div className={`w-16 h-16 bg-${item.color}-400 rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <div className={`w-8 h-8 bg-${item.color}-300 rounded`}></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection: React.FC<{ navigateToMainApp: () => void }> = ({ navigateToMainApp }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleTryNow = () => {
    // Navigate to main app using the splash navigation hook
    navigateToMainApp();
  };

  return (
    <section ref={ref} className="relative z-10 h-screen flex items-center justify-center px-8">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-6xl font-bold text-white mb-8"
        >
          Ready to <span className="text-blue-400">Create</span>?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Join thousands of creators who are already transforming their ideas into reality 
          with DroidForge 3D's revolutionary AI-powered platform.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTryNow}
          className="group relative px-12 py-4 bg-gradient-to-r from-blue-500 via-orange-500 to-green-500 text-white text-xl font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 via-orange-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <span className="relative z-10">Try it Now</span>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-orange-500 to-green-500 rounded-full opacity-20 blur-sm"
          />
        </motion.button>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 text-gray-400"
        >
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>5 Free Generations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Premium Materials</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

