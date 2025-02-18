import React, { useState } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { 
  PieChart, Pie, 
  BarChart, Bar, 
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer 
} from 'recharts';
import AIRecommendationCard from '../components/ai/AIRecommendationCard';
import AIRecommendationModal from '../components/ai/AIRecommendationModal';

const treeSpeciesData = [
  { name: 'Oak', value: 400 },
  { name: 'Maple', value: 300 },
  { name: 'Pine', value: 200 },
  { name: 'Birch', value: 150 }
];

const healthIndicatorsData = [
  { month: 'Jan', healthy: 400, atrisk: 240, critical: 100 },
  { month: 'Feb', healthy: 420, atrisk: 220, critical: 90 },
  // Add more data points
];

// Sample data for AI prediction line graph
const predictionData = [
  { month: 'Jan', actual: 65, predicted: 70 },
  { month: 'Feb', actual: 75, predicted: 78 },
  { month: 'Mar', actual: 85, predicted: 82 },
  { month: 'Apr', actual: 70, predicted: 72 },
  { month: 'May', actual: 90, predicted: 88 },
  { month: 'Jun', actual: 100, predicted: 95 },
];

// Sample data for borough comparison
const boroughData = [
  { name: 'Manhattan', actual: 150, predicted: 165 },
  { name: 'Brooklyn', actual: 200, predicted: 210 },
  { name: 'Queens', actual: 180, predicted: 175 },
  { name: 'Bronx', actual: 130, predicted: 140 },
  { name: 'Staten Island', actual: 90, predicted: 85 },
];

// Sample data for recommendation cards
const recommendationCards = [
  {
    srId: '12345',
    description: 'Large oak tree showing signs of disease in Central Park',
    aiRecommendation: 'Immediate pruning recommended. High risk of branch failure within 30 days. Schedule emergency maintenance.',
    riskLevel: 'High',
    priority: 'Urgent',
    location: 'Central Park, near Bethesda Fountain',
    timeline: '3-5 days'
  },
  {
    srId: '12346',
    description: 'Multiple trees affected by recent storm damage',
    aiRecommendation: 'Group maintenance recommended. Prioritize removal of hanging branches. Schedule within 7 days.'
  },
  {
    srId: '12347',
    description: 'Young maple trees showing stress from drought',
    aiRecommendation: 'Implement supplemental watering schedule. Monitor soil moisture levels weekly.'
  }
];

const AIRecommendations = () => {
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  const handleCardClick = (cardData) => {
    setSelectedRecommendation(cardData);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>AI Recommendations</Typography>
      
      <Grid container spacing={3}>
        {/* Tree Health Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Tree Health Analysis</Typography>
            <BarChart width={500} height={300} data={healthIndicatorsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="healthy" fill="#4CAF50" />
              <Bar dataKey="atrisk" fill="#FFC107" />
              <Bar dataKey="critical" fill="#F44336" />
            </BarChart>
          </Paper>
        </Grid>

        {/* Species Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Species Distribution</Typography>
            <PieChart width={500} height={300}>
              <Pie
                data={treeSpeciesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              />
              <Tooltip />
            </PieChart>
          </Paper>
        </Grid>

        {/* AI Prediction Line Graph */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Service Request Predictions vs Actual
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#8884d8" 
                    name="Actual Requests"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#82ca9d" 
                    name="AI Predicted"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Borough Comparison */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Borough-wise Demand Analysis
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={boroughData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actual" fill="#8884d8" name="Actual Requests" />
                  <Bar dataKey="predicted" fill="#82ca9d" name="AI Predicted" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* AI Recommendation Cards */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Critical AI Insights
          </Typography>
          <Grid container spacing={3}>
            {recommendationCards.map((card, index) => (
              <Grid item xs={12} md={4} key={index}>
                <AIRecommendationCard
                  {...card}
                  index={index}
                  onClick={() => handleCardClick(card)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <AIRecommendationModal
        open={!!selectedRecommendation}
        onClose={() => setSelectedRecommendation(null)}
        recommendation={selectedRecommendation}
      />
    </Box>
  );
};

export default AIRecommendations; 