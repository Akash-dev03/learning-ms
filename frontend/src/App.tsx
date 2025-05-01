import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { auth } from "@/lib/api";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import BookDetails from "./pages/BookDetails";
import NotFound from "./pages/NotFound";
import BrowseBooks from "./pages/BrowseBooks";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import About from "./pages/About";
import ContactSupport from "./pages/ContactSupport";
import ChatBot from "./pages/ChatBot";
import Hero from "./pages/Hero";
import AdminRoute from "./components/AdminRoute";

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Optimize by preventing refetch on window focus
      staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
    },
  },
});

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check local storage for login status on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await auth.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      handleLogout();
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    fetchUserProfile();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isLoggedIn, user, login: handleLogin, logout: handleLogout }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Hero />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactSupport />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected routes - require login */}
              <Route path="/home" element={isLoggedIn ? <Index /> : <Navigate to="/login" />} />
              <Route path="/books" element={isLoggedIn ? <BrowseBooks /> : <Navigate to="/login" />} />
              <Route path="/books/:id" element={isLoggedIn ? <BookDetails /> : <Navigate to="/login" />} />
              <Route path="/chat" element={isLoggedIn ? <ChatBot /> : <Navigate to="/login" />} />
              <Route path="/account" element={isLoggedIn ? <Account /> : <Navigate to="/login" />} />
              
              {/* Admin routes - require login and admin status */}
              <Route 
                path="/admin" 
                element={
                  isLoggedIn ? (
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  ) : (
                    <Navigate to="/login" />
                  )
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  isLoggedIn ? (
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  ) : (
                    <Navigate to="/login" />
                  )
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  isLoggedIn ? (
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  ) : (
                    <Navigate to="/login" />
                  )
                } 
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
