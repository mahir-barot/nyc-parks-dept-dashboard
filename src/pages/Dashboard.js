import React, { useState, useEffect } from 'react';
import { Grid, Paper, Box, Typography, Divider, CircularProgress } from '@mui/material';
import MetricCard from '../components/dashboard/MetricCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import MapView from '../components/dashboard/MapView';
import AIRecommendationsWidget from '../components/dashboard/AIRecommendationsWidget';

const Dashboard = () => {
  const [mapMarkers, setMapMarkers] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchServiceRequests(),
      generateAIHotspots()
    ]).then(() => setLoading(false))
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const fetchServiceRequests = async () => {
    try {
      const response = await fetch('https://data.cityofnewyork.us/resource/mu46-p9is.json?$limit=10');
      if (!response.ok) {
        throw new Error('Failed to fetch service requests');
      }
      const data = await response.json();
      
      // Transform the data into map markers, filtering out invalid coordinates
      const markers = data
        .filter(request => {
          const lat = parseFloat(request.latitude);
          const lng = parseFloat(request.longitude);
          return (
            !isNaN(lat) && 
            !isNaN(lng) && 
            lat !== 0 && 
            lng !== 0 && 
            lat >= -90 && 
            lat <= 90 && 
            lng >= -180 && 
            lng <= 180
          );
        })
        .map(request => {
          try {
            return {
              position: [
                parseFloat(request.latitude),
                parseFloat(request.longitude)
              ],
              name: `${request.buildingnumber || 'N/A'} ${request.streetname || 'Unknown Street'}, ${request.boroughcode || 'Unknown Borough'}`,
              details: `${request.srtype || 'Unknown Type'} - ${request.srstatus || 'Unknown Status'}
                       Priority: ${request.srpriority || 'Not Specified'}
                       Created: ${request.createddate ? new Date(request.createddate).toLocaleDateString() : 'Date Unknown'}`
            };
          } catch (err) {
            console.warn('Error processing marker:', err);
            return null;
          }
        })
        .filter(marker => marker !== null); // Remove any markers that failed to process

      if (markers.length === 0) {
        setError('No valid locations found in the data');
        setLoading(false);
        return;
      }

      setMapMarkers(markers);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const generateAIHotspots = async () => {
    try {
      const response = await fetch('https://data.cityofnewyork.us/resource/mu46-p9is.json?$limit=100');
      if (!response.ok) throw new Error('Failed to fetch data for hotspot analysis');
      
      const data = await response.json();
      
      // Group incidents by location (simplified for example)
      const locationClusters = data.reduce((acc, request) => {
        const lat = parseFloat(request.latitude);
        const lng = parseFloat(request.longitude);
        
        if (isNaN(lat) || isNaN(lng)) return acc;
        
        const key = `${Math.round(lat * 100) / 100},${Math.round(lng * 100) / 100}`;
        if (!acc[key]) {
          acc[key] = {
            count: 0,
            lat,
            lng,
            types: new Set(),
          };
        }
        acc[key].count++;
        acc[key].types.add(request.srtype);
        return acc;
      }, {});

      // Generate hotspots from clusters
      const generatedHotspots = Object.values(locationClusters)
        .filter(cluster => cluster.count >= 2) // Only create hotspots for areas with multiple incidents
        .map(cluster => ({
          center: [cluster.lat, cluster.lng],
          radius: cluster.count * 1000, // Radius based on incident count
          color: getHotspotColor(cluster.count),
          riskLevel: getRiskLevel(cluster.count),
          predictedIncidents: Math.round(cluster.count * 1.5), // Simple prediction
          category: Array.from(cluster.types).join(', ')
        }));

      setHotspots(generatedHotspots);
    } catch (err) {
      console.error('Error generating hotspots:', err);
    }
  };

  const getHotspotColor = (count) => {
    if (count >= 5) return '#ff0000'; // High risk - red
    if (count >= 3) return '#ff9900'; // Medium risk - orange
    return '#ff0000'; // Low risk - yellow
  };

  const getRiskLevel = (count) => {
    if (count >= 5) return 'High';
    if (count >= 3) return 'Medium';
    return 'Low';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard Overview
      </Typography>

      {/* Metrics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Service Requests"
            value={124}
            trend={+15}
            icon="request"
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Pending Work Orders"
            value={67}
            trend={-5}
            icon="work"
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Upcoming Plantations"
            value={45}
            trend={+8}
            icon="tree"
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="AI Recommendations"
            value={12}
            trend={+3}
            icon="ai"
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              }
            }}
          >
            <Typography variant="h6" gutterBottom>Activity Overview</Typography>
            <Divider sx={{ mb: 2 }} />
            <ActivityChart />
          </Paper>
        </Grid>

        {/* AI Recommendations Widget */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              }
            }}
          >
            <Typography variant="h6" gutterBottom>AI Insights</Typography>
            <Divider sx={{ mb: 2 }} />
            <AIRecommendationsWidget />
          </Paper>
        </Grid>

        {/* Map View */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              }
            }}
          >
            <Typography variant="h6" gutterBottom>Service Request Locations</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 500, width: '100%', position: 'relative' }}>
              {loading ? (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography color="error" align="center">
                  Error loading map data: {error}
                </Typography>
              ) : (
                <MapView 
                  markers={mapMarkers} 
                  hotspots={hotspots}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 