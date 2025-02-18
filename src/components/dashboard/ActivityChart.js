import React from 'react';
import { Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Jan', requests: 40, completions: 24 },
  { name: 'Feb', requests: 30, completions: 35 },
  { name: 'Mar', requests: 20, completions: 25 },
  { name: 'Apr', requests: 27, completions: 22 },
];

const ActivityChart = () => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Monthly Activities</Typography>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="requests" stroke="#8884d8" />
        <Line type="monotone" dataKey="completions" stroke="#82ca9d" />
      </LineChart>
    </>
  );
};

export default ActivityChart; 