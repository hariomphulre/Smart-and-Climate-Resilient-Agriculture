import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MdDashboard } from "react-icons/md";
import { MdOutlineStorage } from "react-icons/md";
import { MdStorage } from "react-icons/md";
import { 
  faTractor, 
  faDatabase, 
  faArrowRightFromBracket,
  faLayerGroup,
  faChartLine,
  faLeaf,
  faCloudSunRain,
  faDroplet,
  faCog,
  faAngleRight,
  faAngleDown,
  faUser,
  faUserGear,
  faChevronLeft,
  faChevronRight,
  faRobot
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isSidebarOpen, isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    analytics: true,
    market_place: true
  });
  
  // Detect screen size for responsive behavior
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (menu) => {
    // Don't expand menus if sidebar is collapsed on desktop
    if (!isMobile && isCollapsed) {
      toggleSidebar(); // Expand the sidebar first
      return;
    }
    
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside 
      id="sidebar"
      className={`fixed top-0 left-0 z-40 h-screen pt-14 transition-all duration-300 ease-in-out bg-white border-r border-gray-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${isMobile ? 'w-72' : ''} ${!isMobile && isCollapsed ? 'md:w-15.5' : 'md:w-63'}` }
      aria-label="Sidebar"
    >
      <div className="h-118.5 px-0 overflow-y-auto">
        <div className="flex items-center justify-between py-0 px-0 h-7">      
          {/* Toggle button - only visible on desktop */}
          <button 
            onClick={toggleSidebar} 
            type="button" 
            className="hidden md:inline-flex items-center justify-center p-1 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-expanded={!isCollapsed}
          >
            <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} className="w-5 h-5" />
            <span className="sr-only">Toggle sidebar</span>
          </button>
        </div>
        
        {/* <div style={{marginTop: "16px", width: "100%"}} className="border-t border-gray-500"></div> */}
        
        {/* Navigation Links */}
        
        <ul className="space-y-0">
          <li>
            <Link
              to="/"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'pl-5'} ${
                isActive('/') ? 'bg-green-100 text-green-800' : 'text-gray-900 hover:bg-gray-100'
              } group`}
            >
              <div style={{fontSize: "19px"}} className="dashboard-icon text-gray-500 group-hover:text-gray-900"><MdDashboard /></div>
              
              {!isCollapsed && <span className="flex-1 ml-5 whitespace-nowrap">Dashboard</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/reports"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'pl-5'} ${
                isActive('/reports') ? 'bg-green-100 text-green-800' : 'text-gray-900 hover:bg-gray-100'
              } group`}
            >
              <div style={{fontSize: "19px"}} className="report-icon mt-0 text-gray-500 group-hover:text-gray-900"><MdStorage /></div>
              
              {!isCollapsed && <span className="flex-1 ml-5.5 whitespace-nowrap">Reports</span>}
            </Link>
          </li>
          
          <li>
            <Link
              to="/farm-console"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'pl-5'} ${
                isActive('/farm-console') 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-900 hover:bg-gray-100'
              } group`}
            >
              <FontAwesomeIcon icon={faUserGear} className={`w-5 h-5 text-gray-500 transition ${isActive('/farm-console') ? 'text-green-700' : 'group-hover:text-gray-900'}`} />
              {!isCollapsed && <span className="flex-1 ml-5.5 whitespace-nowrap">Farm Console</span>}
            </Link>
          </li>

          {/* Analytics Section */}
          <li>
            <button
              type="button"
              className={`flex items-center w-full text-base transition duration-75 group ${
                isCollapsed ? 'justify-center' : ''
              } text-gray-900 hover:bg-gray-100`}
              onClick={() => toggleMenu('analytics')}
            >
              {!isCollapsed && (
                <>
                  <span style={{fontWeight: "500"}} className="flex-1 ml-3 text-left whitespace-nowrap">Climate Analysis</span>
                  <FontAwesomeIcon
                    icon={expandedMenus.analytics ? faAngleDown : faAngleRight}
                  />
                </>
              )}
            </button>

            {expandedMenus.analytics && (
              <ul className="py-0 space-y-0">
                <li>
                  <Link
                    to="/climate"
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'pl-5'} w-full text-base transition duration-75 ${
                      isActive('/climate') ? 'bg-green-100 text-green-800' : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon
                      icon={faCloudSunRain}
                      className={`w-5 h-5 ${isActive('/climate') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`}
                    />
                    {!isCollapsed && <span className="ml-5.5">Weather Forecast</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vegetation"
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'pl-5'} w-full text-base transition duration-75 ${
                      isActive('/vegetation') ? 'bg-green-100 text-green-800' : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon
                      icon={faLeaf}
                      className={`w-5 h-5 ${isActive('/vegetation') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`}
                    />
                    {!isCollapsed && <span className="ml-5.5">Vegetation Health</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/irrigation"
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'pl-5'} w-full text-base transition duration-75 ${
                      isActive('/water') ? 'bg-green-100 text-green-800' : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon
                      icon={faDroplet}
                      className={`w-5 h-5 ${isActive('/water') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`}
                    />
                    {!isCollapsed && <span className="ml-5.5">Irrigation</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/hazard_activities"
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'pl-5'} w-full text-base transition duration-75 ${
                      isActive('/water') ? 'bg-green-100 text-green-800' : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon
                      icon={faDroplet}
                      className={`w-5 h-5 ${isActive('/water') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`}
                    />
                    {!isCollapsed && <span className="ml-5.5">Hazard Activities</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/monsoon"
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'pl-5'} w-full text-base transition duration-75 ${
                      isActive('/water') ? 'bg-green-100 text-green-800' : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon
                      icon={faDroplet}
                      className={`w-5 h-5 ${isActive('/water') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`}
                    />
                    {!isCollapsed && <span className="ml-5.5">Monsoon info</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/soil"
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'pl-5'} w-full text-base transition duration-75 ${
                      isActive('/soil') ? 'bg-green-100 text-green-800' : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                      <FontAwesomeIcon 
                        icon={faLayerGroup}
                        className={`w-5 h-5 ${isActive('/soil') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`}
                      />
        
                    {!isCollapsed && <span className="ml-5.5">Soil info</span>}
                  </Link>
                </li>
              </ul>
            )}
          </li>


          <li>
            <button
              type="button"
              className={`flex items-center w-full text-base transition duration-75 group ${
                isCollapsed ? 'justify-center' : ''
              } text-gray-900 hover:bg-gray-100`}
              onClick={() => toggleMenu('market_place')}
            >
              {!isCollapsed && (
                <>
                  <span style={{fontWeight: "500"}} className="flex-1 ml-3 text-left whitespace-nowrap">Market Place</span>
                  <FontAwesomeIcon
                    icon={expandedMenus.market_place ? faAngleDown : faAngleRight}
                  />
                </>
              )}
            </button>
            
            {expandedMenus.market_place && (
              <ul className="py-0 space-y-0">
                <li>
                  <Link
                    to="/inventory"
                    className={`flex items-center pl-5 w-full text-base transition duration-75 ${
                      isActive('/inventory') 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon icon={faDroplet} className={`w-5 h-5 ${isActive('/inventory') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`}/>
                    {!isCollapsed && <span className="ml-5.5">Inventory</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/p2p-trade"
                    className={`flex items-center pl-5 w-full text-base transition duration-75 ${
                      isActive('/p2p-trade') 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon icon={faLeaf} className={`w-4 h-4 mr-5.5 ${isActive('/p2p-trade') ? 'text-green-700' : 'text-gray-500 group-hover:text-gray-900'}`} />
                    {!isCollapsed && <span>P2P Trade</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bidding"
                    className={`flex items-center pl-5 w-full text-base transition duration-75 ${
                      isActive('/bidding') 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon icon={faDroplet} className={`w-4 h-4 mr-5.5 ${isActive('/bidding') ? 'text-green-700 ' : 'text-gray-500 group-hover:text-gray-900'}`} />
                    {!isCollapsed && <span>Bidding</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/crop-prices"
                    className={`flex items-center pl-5 w-full text-base transition duration-75 ${
                      isActive('/crop-prices') 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon icon={faDroplet} className={`w-4 h-4 mr-5.5 ${isActive('/crop-prices') ? 'text-green-700 ' : 'text-gray-500 group-hover:text-gray-900'}`} />
                    {!isCollapsed && <span>Crop Prices</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seed-prices"
                    className={`flex items-center pl-5 w-full text-base transition duration-75 ${
                      isActive('/seed-prices') 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon icon={faDroplet} className={`w-4 h-4 mr-5.5 ${isActive('/seed-prices') ? 'text-green-700 ' : 'text-gray-500 group-hover:text-gray-900'}`} />
                    {!isCollapsed && <span>Seed Prices</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/govt-schemes"
                    className={`flex items-center pl-5 w-full text-base transition duration-75 ${
                      isActive('/govt-schemes') 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon icon={faDroplet} className={`w-4 h-4 mr-5.5 ${isActive('/govt-schemes') ? 'text-green-700 ' : 'text-gray-500 group-hover:text-gray-900'}`} />
                    {!isCollapsed && <span>Govt. Schemes</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/govt-schemes"
                    className={`flex items-center pl-5 w-full text-base transition duration-75 ${
                      isActive('/govt-schemes') 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-900 hover:bg-gray-100'
                    } group`}
                  >
                    <FontAwesomeIcon icon={faDroplet} className={`w-4 h-4 mr-5.5 ${isActive('/govt-schemes') ? 'text-green-700 ' : 'text-gray-500 group-hover:text-gray-900'}`} />
                    {!isCollapsed && <span>Govt. Schemes</span>}
                  </Link>
                </li>
                
              </ul>
            )}
          </li>
        </ul>
      </div>

      <div style={{display: "flex", flexDirection: "column"}} className={`sidebar-bttom mt-0 ${isCollapsed ? '' : ''}`}>

        <div className="border-t border-gray-300 pt-2 pb-2">
          <Link
            to="/ai-assistant"
            className={`flex items-center h-6 px-5 ${isCollapsed ? '' : 'w-63'} ${
              isActive('/ai-assistant') 
                ? 'bg-green-100 text-green-800' 
                : 'text-gray-900 hover:bg-gray-100'
            } group`}
          >
            <FontAwesomeIcon icon={faRobot} className={`w-5 h-5 text-gray-500 transition ${isActive('/ai-assistant') ? 'text-gray-900' : 'group-hover:text-gray-900'}`} />
            {!isCollapsed && <span className="ml-3 whitespace-nowrap">AI Assistant</span>}
          </Link>
        </div>

        <div className="border-t border-gray-300 pt-2 pb-2">
          <Link
            to="/profile"
            className={`flex items-center h-6 px-5 ${isCollapsed ? '' : 'w-63'} text-gray-900 hover:bg-gray-50 hover:text-gray-900 group transition-colors`}
          >
            <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-gray-500 transition group-hover:text-gray-900" />
            {!isCollapsed && <span className="ml-3">Admin</span>}
            {/* <div className="text-xs text-gray-500">admin@example.com</div> */}
          </Link>
        </div>
        <div className="border-t border-gray-300 pt-2 pb-2">
          <Link
            to="/profile"
            className={`flex items-center h-6 px-5 ${isCollapsed ? '' : 'w-63'} text-gray-900 hover:bg-gray-50 hover:text-gray-900 group transition-colors`}
          >
            <FontAwesomeIcon icon={faCog} className="w-5 h-5 text-gray-500 transition group-hover:text-gray-900" />
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </Link>
        </div>

        <div className="border-t border-gray-300 pt-2 pb-2">
          <Link
            to="/logout"
            className={`flex items-center h-6 px-5 ${isCollapsed ? '' : 'w-63'} text-gray-900 hover:bg-red-50 hover:text-red-700 group transition-colors`}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-5 h-5 text-gray-500 transition group-hover:text-red-900"></FontAwesomeIcon>
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
