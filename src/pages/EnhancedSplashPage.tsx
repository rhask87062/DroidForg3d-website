import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useSplashNavigation } from '../components/SplashRouter';

// Enhanced Particle Background Component
const ParticleBackground = ({ section = 'hero' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles based on section
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(250, Math.floor((canvas.width * canvas.height) / 6000)); // Increased density
      
      for (let i = 0; i < particleCount; i++) {
        const particle = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 3 + 1.5, // Slightly larger particles
          opacity: Math.random() * 0.9 + 0.3, // Higher base opacity
          hue: getHueForSection(section),
          life: Math.random() * 100,
          maxLife: 100 + Math.random() * 100,
          type: Math.random() > 0.6 ? 'geometric' : 'dot' // More geometric shapes
        };
        particlesRef.current.push(particle);
      }
    };

    const getHueForSection = (sectionType) => {
      switch (sectionType) {
        case 'hero': return 25; // Classic orange (#ff6b35)
        case 'ai': return 200; // Electric blue (#00d4ff)
        case 'generation': return 160; // Neon green (#00ff88)
        case 'printing': return 25; // Classic orange (#ff6b35) - emphasizing brand
        case 'gallery': return 280; // Tech purple (#8b5cf6)
        default: return 25; // Default to classic orange
      }
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 300) { // Increased interaction range
          const force = (300 - distance) / 300;
          particle.vx += (dx / distance) * force * 0.015;
          particle.vy += (dy / distance) * force * 0.015;
          particle.opacity = Math.min(1, particle.opacity + force * 0.05);
        }

        // Boundary wrapping
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        // Life cycle
        particle.life += 0.5;
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.opacity = Math.random() * 0.8 + 0.2;
          particle.hue = getHueForSection(section);
        }

        // Damping
        particle.vx *= 0.995;
        particle.vy *= 0.995;
      });
    };

    const drawConnections = () => {
      ctx.strokeStyle = `hsla(${getHueForSection(section)}, 70%, 60%, 0.2)`; // Increased base opacity
      ctx.lineWidth = 2; // Thicker lines

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) { // Increased connection distance
            const opacity = (200 - distance) / 200 * 0.4; // Higher max opacity
            ctx.strokeStyle = `hsla(${getHueForSection(section)}, 70%, 60%, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const drawParticles = () => {
      particlesRef.current.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;

        if (particle.type === 'geometric') {
          // Draw geometric shapes
          const sides = Math.floor(Math.random() * 3) + 3; // 3-6 sides
          drawPolygon(ctx, particle.x, particle.y, particle.size, sides, particle.hue);
        } else {
          // Particle glow
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 5 // Larger glow
          );
          gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, 0.9)`); // Brighter core
          gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 70%, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
          ctx.fill();

          // Particle core
          ctx.fillStyle = `hsla(${particle.hue}, 100%, 80%, 1)`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });
    };

    const drawPolygon = (ctx, x, y, size, sides, hue) => {
      const angle = (Math.PI * 2) / sides;
      
      // Glow effect for geometric shapes
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 0.6)`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 70%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const px = x + Math.cos(i * angle) * size * 3;
        const py = y + Math.sin(i * angle) * size * 3;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      
      // Outline
      ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.9)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < sides; i++) {
        const px = x + Math.cos(i * angle) * size;
        const py = y + Math.sin(i * angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      
      ctx.closePath();
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateParticles();
      drawConnections();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [section]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

// Dynamic Background Component
const DynamicBackground = ({ section }) => {
  const getBackgroundStyle = () => {
    switch (section) {
      case 'hero':
        return {
          background: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15) 0%, rgba(10, 10, 10, 0.9) 70%)',
        };
      case 'ai':
        return {
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, rgba(10, 10, 10, 0.9) 70%)',
        };
      case 'generation':
        return {
          background: 'radial-gradient(ellipse at center, rgba(0, 255, 136, 0.15) 0%, rgba(10, 10, 10, 0.9) 70%)',
        };
      case 'printing':
        return {
          background: 'radial-gradient(ellipse at center, rgba(255, 107, 53, 0.15) 0%, rgba(10, 10, 10, 0.9) 70%)',
        };
      case 'gallery':
        return {
          background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.15) 0%, rgba(10, 10, 10, 0.9) 70%)',
        };
      default:
        return {
          background: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15) 0%, rgba(10, 10, 10, 0.9) 70%)',
        };
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-0"
      style={getBackgroundStyle()}
      animate={getBackgroundStyle()}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    />
  );
};

// Interactive 3D Model Component
const Interactive3DModel = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const modelRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (modelRef.current) {
        const rect = modelRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const rotateX = (e.clientY - centerY) / 10;
        const rotateY = (e.clientX - centerX) / 10;
        
        setRotation({ x: rotateX, y: rotateY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={modelRef}
      className="relative w-64 h-64 mx-auto perspective-1000"
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        {/* Wireframe Cube */}
        <div className="absolute inset-0 border-2 border-blue-400 opacity-60 animate-pulse" />
        <div className="absolute inset-2 border border-blue-300 opacity-40" />
        <div className="absolute inset-4 border border-blue-200 opacity-20" />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-4 left-4 w-4 h-4 bg-orange-400 rounded-full"
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-4 right-4 w-3 h-3 bg-green-400 rounded-full"
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
      </motion.div>
    </div>
  );
};

// Enhanced Section Components
const HeroSection = ({ navigateToMainApp }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.section
      ref={ref}
      className="min-h-screen flex items-center justify-center relative z-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center max-w-4xl">
        <motion.h1
          className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-orange-400 via-blue-400 to-orange-500 bg-clip-text text-transparent"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          DROIDFORG3D
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: isInView ? 0 : 30, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Where AI meets 3D printing. Droid generates stunning models with artificial intelligence,
          <br />
          while Forge brings them to life with precision 3D printing.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: isInView ? 0 : 30, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <motion.button
            onClick={navigateToMainApp}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Start Creating</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              layoutId="button-bg"
            />
          </motion.button>
          
          <motion.button
            className="px-8 py-4 border-2 border-orange-400 text-orange-400 font-bold rounded-lg text-lg hover:bg-orange-400 hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Gallery
          </motion.button>
        </motion.div>
        
        <motion.div
          className="mt-12 flex justify-center items-center gap-8 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span>5 Free Generations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
            <span>Premium Materials</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

const AISection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.section
      ref={ref}
      className="min-h-screen flex items-center justify-center relative z-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: isInView ? 0 : -50, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            The "Droid"
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Our advanced AI system transforms your wildest ideas into detailed 3D models. 
            Using cutting-edge machine learning algorithms, Droid understands context, 
            style, and functionality to create models that exceed your expectations.
          </p>
          
          <div className="space-y-4">
            <motion.div
              className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
            >
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                🧠
              </div>
              <div>
                <h3 className="font-semibold text-white">Neural Processing</h3>
                <p className="text-gray-400">Advanced pattern recognition and creative synthesis</p>
              </div>
            </motion.div>
            
            <motion.div
              className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
            >
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                ⚡
              </div>
              <div>
                <h3 className="font-semibold text-white">Instant Generation</h3>
                <p className="text-gray-400">From concept to 3D model in seconds</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          className="relative"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Interactive3DModel />
        </motion.div>
      </div>
    </motion.section>
  );
};

// Main Enhanced Splash Page Component
export function EnhancedSplashPage() {
  const { navigateToMainApp } = useSplashNavigation();
  const { scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState('hero');
  
  // Transform scroll progress to section changes
  const sectionProgress = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], 
    ['hero', 'ai', 'generation', 'printing', 'gallery', 'cta']);

  useEffect(() => {
    const unsubscribe = sectionProgress.onChange((latest) => {
      setCurrentSection(latest);
    });
    return unsubscribe;
  }, [sectionProgress]);

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <DynamicBackground section={currentSection} />
      
      {/* Particle Background */}
      <ParticleBackground section={currentSection} />
      
      {/* Content Sections */}
      <div className="relative z-10">
        <HeroSection navigateToMainApp={navigateToMainApp} />
        <AISection />
        
        {/* Additional sections would go here */}
        <motion.section className="min-h-screen flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              3D Generation
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl">
              Watch as your ideas transform into detailed 3D models through our advanced generation pipeline.
            </p>
          </motion.div>
        </motion.section>
        
        <motion.section className="min-h-screen flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Precision Printing
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl">
              State-of-the-art 3D printing technology brings your digital creations to life.
            </p>
          </motion.div>
        </motion.section>
        
        <motion.section className="min-h-screen flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Gallery Showcase
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl">
              Explore stunning creations from our community of makers and creators.
            </p>
          </motion.div>
        </motion.section>
        
        {/* Final CTA Section */}
        <motion.section className="min-h-screen flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Create?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Join thousands of creators who are already bringing their ideas to life with DroidForge 3D.
            </p>
            <motion.button
              onClick={navigateToMainApp}
              className="px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg text-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Try it Now</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}

