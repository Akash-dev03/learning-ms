import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Book, MessageSquare, User, LogOut, Menu, X, Settings } from 'lucide-react';
import { AuthContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-library-primary rounded-full p-2 mr-2">
                <Book className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-library-dark dark:text-white">Libra Mind</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-6">
              {isLoggedIn && (
                <>
                  <NavLink to="/home" active={isActive('/home')}>Home</NavLink>
                  <NavLink to="/books" active={isActive('/books')}>Browse</NavLink>
                  <NavLink to="/chat" active={isActive('/chat')}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    AI Chat
                  </NavLink>
                  <NavLink to="/about" active={isActive('/about')}>About</NavLink>
                  <NavLink to="/contact" active={isActive('/contact')}>Support</NavLink>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center ml-4 space-x-4">
                {user?.is_admin && (
                  <Link to="/admin">
                    <Button 
                      size="sm"
                      className="bg-library-primary hover:bg-library-secondary text-white flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">Admin Panel</span>
                      <span className="md:hidden">Admin</span>
                    </Button>
                  </Link>
                )}
                <Link to="/account" className="text-gray-700 dark:text-gray-300 hover:text-library-primary dark:hover:text-library-primary">
                  <span className="hidden md:inline">Account</span>
                  <User className="h-5 w-5 md:hidden" />
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center ml-4">
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-library-primary dark:hover:text-library-primary mr-4">
                  <span className="hidden md:inline">Login</span>
                  <User className="h-5 w-5 md:hidden" />
                </Link>
                <Link to="/signup">
                  <Button
                    size="sm"
                    className="bg-library-primary hover:bg-library-secondary text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            
            {isLoggedIn && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-4 md:hidden text-gray-700 dark:text-gray-300"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && isLoggedIn && (
          <motion.div 
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 space-y-3">
              <MobileNavLink to="/home" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/books" onClick={() => setMobileMenuOpen(false)}>Browse</MobileNavLink>
              <MobileNavLink to="/chat" onClick={() => setMobileMenuOpen(false)}>AI Chat</MobileNavLink>
              {user?.is_admin && (
                <MobileNavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </MobileNavLink>
              )}
              <MobileNavLink to="/account" onClick={() => setMobileMenuOpen(false)}>My Account</MobileNavLink>
              <MobileNavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
              <MobileNavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>Support</MobileNavLink>
              
              <Button
                variant="outline"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center mt-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => (
  <Link
    to={to}
    className={`flex items-center text-gray-700 dark:text-gray-300 hover:text-library-primary dark:hover:text-library-primary px-2 py-1 rounded transition-colors ${
      active ? "text-library-primary font-medium" : ""
    }`}
  >
    {children}
  </Link>
);

interface MobileNavLinkProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-library-primary/10 dark:hover:bg-library-primary/20 hover:text-library-primary dark:hover:text-library-primary rounded-md transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;
