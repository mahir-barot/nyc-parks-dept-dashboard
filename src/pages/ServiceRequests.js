import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend 
} from 'recharts';

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
  { field: 'srstatus', headerName: 'Status', width: 130 },
  { field: 'srpriority', headerName: 'Priority', width: 130 },
  { 
    field: 'createddate', 
    headerName: 'Date Submitted', 
    width: 180,
    valueFormatter: (params) => new Date(params.value).toLocaleDateString()
  },
  { field: 'complaintdetails', headerName: 'Details', width: 300 },
  { field: 'srresolution', headerName: 'Resolution', width: 200 }
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [boroughStats, setBoroughStats] = useState([]);
  const [requestTypeStats, setRequestTypeStats] = useState([]);

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      const response = await fetch('https://data.cityofnewyork.us/resource/mu46-p9is.json?$limit=77');

      if (!response.ok) {
        throw new Error('Failed to fetch service requests');
      }
      const data = await response.json();
      
      const processedData = data.map(request => ({
        ...request,
        id: request.objectid
      }));
      
      setRequests(processedData);

      // Calculate borough statistics
      const boroughCount = data.reduce((acc, request) => {
        const borough = request.boroughcode || 'Unknown';
        acc[borough] = (acc[borough] || 0) + 1;
        return acc;
      }, {});

      const boroughData = Object.entries(boroughCount).map(([name, value]) => ({
        name,
        value
      }));

      // Calculate request type statistics
      const typeCount = data.reduce((acc, request) => {
        const type = request.srtype || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const typeData = Object.entries(typeCount)
        .map(([name, count]) => ({
          name,
          count
        }))
        .sort((a, b) => b.count - a.count) // Sort by count in descending order
        .slice(0, 10); // Take top 10 request types

      setBoroughStats(boroughData);
      setRequestTypeStats(typeData);
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
      <Typography variant="h4" sx={{ mb: 3 }}>Service Requests</Typography>

      {/* Analytics Dashboard */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Borough Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Requests by Borough
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={boroughStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {boroughStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Request Types Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Request Types
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={requestTypeStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Existing Search and Grid */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={2}>
            <Button variant="contained" color="primary">
              New Request
            </Button>
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
            checkboxSelection
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

export default ServiceRequests; 