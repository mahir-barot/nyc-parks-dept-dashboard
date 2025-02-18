import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Grid, 
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// Import AI confidence images
import aiConfidence1 from '../assets/images/image.png';
import aiConfidence2 from '../assets/images/image.png';
import aiConfidence3 from '../assets/images/image.png';
import aiConfidence4 from '../assets/images/image.png';
import aiConfidence5 from '../assets/images/image.png';

// Map confidence levels to images
const confidenceImages = {
  1: aiConfidence1,
  2: aiConfidence2,
  3: aiConfidence3,
  4: aiConfidence4,
  5: aiConfidence5,
};

// Custom AI confidence component with image
const AIConfidenceIndicator = ({ value }) => {
  const confidenceLevel = Math.round(value);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img 
        src={confidenceImages[confidenceLevel]} 
        alt={`AI Confidence Level ${confidenceLevel}`}
        style={{ 
          height: '24px', 
          width: 'auto',
          marginRight: '8px'
        }} 
      />
      
    </Box>
  );
};

// Function to calculate mock ETA based on request type and priority
const calculateMockETA = (request) => {
  const baselineDays = {
    'Hazard': 3,
    'Root/Sewer/Sidewalk': 7,
    'Pruning': 5,
    'Planting': 14
  };

  const priorityMultiplier = {
    'High': 0.5,    // Reduce time for high priority
    'Medium': 1,    // Normal time
    'Routine': 1.5, // Increase time for routine
    'Low': 2        // Double time for low priority
  };

  const baseline = baselineDays[request.srcategory] || 5;
  const multiplier = priorityMultiplier[request.srpriority] || 1;
  
  return Math.round(baseline * multiplier);
};

const columns = [
  { field: 'complaintnumber', headerName: 'Request ID', width: 150 },
  { 
    field: 'location', 
    headerName: 'Location', 
    width: 250,
    valueGetter: (params) => 
      `${params.row.buildingnumber} ${params.row.streetname}, ${params.row.boroughcode}`
  },
  { field: 'srtype', headerName: 'Request Type', width: 180 },
  { field: 'srpriority', headerName: 'Priority', width: 130 },
  { 
    field: 'createddate', 
    headerName: 'Created Date', 
    width: 180,
    valueFormatter: (params) => new Date(params.value).toLocaleDateString()
  },
  { field: 'complaintdetails', headerName: 'Details', width: 300 },
  { 
    field: 'aiEta', 
    headerName: 'AI Estimated Time', 
    width: 200,
    position: 'fixed',
    renderCell: (params) => (
      <Tooltip title={`AI Confidence: ${params.row.aiConfidence}/5`}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          
          <Typography>{params.value} days</Typography>
          <AIConfidenceIndicator value={params.row.aiConfidence} />
        </Box>
      </Tooltip>
    )
  }
];

const NewServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNewRequests();
  }, []);

  const fetchNewRequests = async () => {
    try {
      // Get last 30 days of requests
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const response = await fetch('https://data.cityofnewyork.us/resource/mu46-p9is.json?$limit=77');
      
      if (!response.ok) {
        throw new Error('Failed to fetch service requests');
      }
      
      const data = await response.json();
      
      // Process and add AI estimates
      const processedData = data.map(request => ({
        ...request,
        id: request.objectid,
        aiEta: calculateMockETA(request),
        aiConfidence: (2 + Math.random() * 3).toFixed(1) // Random confidence between 2-5
      }));

      // Sort by created date (newest first)
      const sortedData = processedData.sort((a, b) => 
        new Date(b.createddate) - new Date(a.createddate)
      );

      setRequests(sortedData);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Error fetching data: ${err.message}`);
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRequests = requests.filter(request => {
    const searchString = searchTerm.toLowerCase();
    return (
      request.complaintnumber?.toLowerCase().includes(searchString) ||
      request.srtype?.toLowerCase().includes(searchString) ||
      request.complaintdetails?.toLowerCase().includes(searchString) ||
      `${request.buildingnumber} ${request.streetname}`.toLowerCase().includes(searchString)
    );
  });

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>New Service Requests</Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField 
              fullWidth
              label="Search Requests"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by ID, type, or location..."
            />
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={filteredRequests}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell': {
                whiteSpace: 'normal',
                lineHeight: 'normal',
                paddingY: 1,
              },
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default NewServiceRequests; 