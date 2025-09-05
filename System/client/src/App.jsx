import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ClimateAnalysis from './pages/ClimateAnalysis';
import FarmConsole from './pages/FarmConsole';
import AIAssistant from './pages/AIAssistant';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/climate" element={<ClimateAnalysis />} />
            <Route path="/farm-console" element={<FarmConsole />} />
            <Route path="/reports" element={<h1>Reports Page (Coming Soon)</h1>} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
