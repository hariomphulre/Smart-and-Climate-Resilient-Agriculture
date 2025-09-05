import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check screen size
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      // Close sidebar when switching between mobile and desktop
      if (isMobileView !== isMobile) {
        setSidebarOpen(false);
      }
      
      // Auto-collapse sidebar on small screens (but not mobile)
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isMobile]);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && 
          !event.target.closest('aside') && 
          !event.target.closest('button[aria-controls="sidebar"]')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);
  
  // Toggle sidebar visibility on mobile or desktop
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      <Navbar />
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        type="button"
        className="md:hidden fixed bottom-4 right-4 z-50 inline-flex items-center p-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 w-12 h-12 justify-center shadow-lg"
        aria-controls="sidebar"
        aria-expanded={sidebarOpen}
      >
        <span className="sr-only">Toggle sidebar</span>
        <FontAwesomeIcon icon={sidebarOpen ? faXmark : faBars} className="text-xl" />
      </button>
      
      {/* Dark Overlay - visible when mobile sidebar is open */}
      {sidebarOpen && isMobile && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 transition-opacity md:hidden"
          aria-hidden="true"
        ></div>
      )}
      
      {/* Sidebar */}
      <Sidebar isSidebarOpen={sidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 mt-16 ${
        isMobile ? 'ml-0' : (isCollapsed ? 'md:ml-20' : 'md:ml-64')
      }`}>
        <main className="p-4 md:p-6">
          <div className="mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
