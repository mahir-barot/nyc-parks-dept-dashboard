import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Grid, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const columns = [
  { field: 'objectid', headerName: 'ID', width: 100 },
  { field: 'wotype', headerName: 'Work Type', width: 180 },
  { field: 'wostatus', headerName: 'Status', width: 130 },
  { 
    field: 'location', 
    headerName: 'Location', 
    width: 250,
    valueGetter: (params) => 
      `${params.row.buildingnumber} ${params.row.streetname}, ${params.row.boroughcode}`
  },
  { field: 'wocategory', headerName: 'Category', width: 180 },
  { 
    field: 'createddate', 
    headerName: 'Created Date', 
    width: 180,
    valueFormatter: (params) => new Date(params.value).toLocaleDateString()
  },
  { field: 'locationdetails', headerName: 'Location Details', width: 150 },
  { field: 'wocontract', headerName: 'Contract', width: 150 }
];

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      const response = await fetch('https://data.cityofnewyork.us/resource/bdjm-n7q4.json');
      
      if (!response.ok) {
        throw new Error('Failed to fetch work orders');
      }

      const data = await response.json();
      
      // Process data for the grid
      const processedData = data.map(order => ({
        ...order,
        id: order.objectid
      }));
      
      setWorkOrders(processedData);

      // Calculate category statistics
      const categoryCount = data.reduce((acc, order) => {
        acc[order.wocategory] = (acc[order.wocategory] || 0) + 1;
        return acc;
      }, {});

      const categoryData = Object.entries(categoryCount).map(([name, count]) => ({
        name,
        count
      }));

      setCategoryStats(categoryData);
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

  const filteredWorkOrders = workOrders.filter(order => {
    const searchString = searchTerm.toLowerCase();
    return (
      order.wotype?.toLowerCase().includes(searchString) ||
      order.wostatus?.toLowerCase().includes(searchString) ||
      order.wocategory?.toLowerCase().includes(searchString) ||
      `${order.buildingnumber} ${order.streetname}`.toLowerCase().includes(searchString)
    );
  });

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Work Orders
      </Typography>

      {/* Category Dashboard */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Work Orders by Category
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryStats}>
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
              <Bar dataKey="count" fill="#2196f3" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Work Orders Grid */}
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField 
              fullWidth
              label="Search Work Orders"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by type, status, or location..."
            />
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={filteredWorkOrders}
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

export default WorkOrders; 