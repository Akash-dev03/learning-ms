
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { Book, ArrowRight, Star, Users, BookOpen, BookMarked } from 'lucide-react';
import { AuthContext } from '../App';
import { motion } from 'framer-motion';

const Hero = () => {
  const { isLoggedIn } = useContext(AuthContext);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <motion.div 
        className="relative bg-gradient-to-r from-library-light to-library-accent overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-library-primary/10 dark:bg-library-primary/20"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 10 + Math.random() * 10,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div 
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-md inline-block">
                <Book className="h-12 w-12 text-library-primary" />
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="text-library-dark dark:text-white">Welcome to </span>
              <span className="text-library-primary">Libra Mind</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl"
            >
              Discover a new world of reading with AI-powered recommendations tailored to your interests.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link to={isLoggedIn ? "/home" : "/login"}>
                <Button 
                  size="lg" 
                  className="bg-library-primary hover:bg-library-secondary text-white font-medium px-8 rounded-full transition-transform hover:scale-105"
                >
                  {isLoggedIn ? "Enter Library" : "Get Started"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-transparent border-2 border-library-primary text-library-primary hover:bg-library-primary/10 dark:text-white dark:hover:bg-library-primary/20 font-medium px-8 rounded-full"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="py-20 px-6 bg-white dark:bg-gray-900"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-library-dark dark:text-white">Why Choose Libra Mind?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Star className="h-10 w-10 text-library-primary mb-4" />,
                title: "Personalized Recommendations",
                description: "Our AI technology learns your preferences to suggest books you'll love."
              },
              {
                icon: <BookOpen className="h-10 w-10 text-library-primary mb-4" />,
                title: "Vast Collection",
                description: "Access thousands of books across all genres and categories."
              },
              {
                icon: <Users className="h-10 w-10 text-library-primary mb-4" />,
                title: "Community",
                description: "Connect with fellow readers and share your favorite books."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-all"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mb-3 text-library-dark dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="py-16 bg-library-accent dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-library-dark dark:text-white">Ready to dive into a world of books?</h2>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              Join Libra Mind today and start your reading journey with personalized recommendations powered by AI.
            </p>
            <Link to={isLoggedIn ? "/home" : "/signup"}>
              <Button className="bg-library-primary hover:bg-library-secondary text-white px-8 py-6 rounded-full text-lg">
                {isLoggedIn ? "Go to My Library" : "Sign Up for Free"}
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
      
      <footer className="bg-library-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Book className="h-6 w-6 text-library-primary mr-2" />
                <span className="text-xl font-bold">Libra Mind Archive</span>
              </div>
              <p className="mt-2 text-gray-300 text-sm">AI-Powered Library Management</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Navigation</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-300 hover:text-white text-sm">Home</Link></li>
                  <li><Link to="/about" className="text-gray-300 hover:text-white text-sm">About</Link></li>
                  <li><Link to="/contact" className="text-gray-300 hover:text-white text-sm">Support</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li><Link to="/contact" className="text-gray-300 hover:text-white text-sm">Help Center</Link></li>
                  <li><Link to="/contact" className="text-gray-300 hover:text-white text-sm">Contact Support</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400">
            <p>© 2025 Libra Mind Archive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
