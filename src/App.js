import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/common/Layout';
import Preloader from './components/common/Preloader';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ServiceRequests = React.lazy(() => import('./pages/ServiceRequests'));
const WorkOrders = React.lazy(() => import('./pages/WorkOrders'));
const Plantation = React.lazy(() => import('./pages/Plantation'));
const AIRecommendations = React.lazy(() => import('./pages/AIRecommendations'));
const NewServiceRequests = React.lazy(() => import('./pages/NewServiceRequests'));

// Custom theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
    },
    background: {
      default: '#FFFFFF',
    },
  },
  spacing: 8,
});

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show preloader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Preloader isLoading={isLoading} />
      <Router>
        <Layout>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/service-requests" element={<ServiceRequests />} />
              <Route path="/new-requests" element={<NewServiceRequests />} />
              <Route path="/work-orders" element={<WorkOrders />} />
              <Route path="/plantation" element={<Plantation />} />
              <Route path="/ai-recommendations" element={<AIRecommendations />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 