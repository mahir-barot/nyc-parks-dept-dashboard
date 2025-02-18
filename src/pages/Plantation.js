import React, { useState } from 'react';
import { Box, Paper, Typography, Tabs, Tab, Grid, Card, CardContent } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const plantationEvents = [
  {
    id: 1,
    title: 'Oak Tree Planting',
    start: new Date(2024, 1, 15),
    end: new Date(2024, 1, 15),
    location: 'Central Park',
    species: 'Red Oak',
    team: 'Team A'
  },
  // Add more events as needed
];

const PlantationList = ({ events }) => (
  <Grid container spacing={2}>
    {events.map((event) => (
      <Grid item xs={12} md={6} key={event.id}>
        <Card>
          <CardContent>
            <Typography variant="h6">{event.title}</Typography>
            <Typography color="textSecondary">Location: {event.location}</Typography>
            <Typography color="textSecondary">Species: {event.species}</Typography>
            <Typography color="textSecondary">Date: {moment(event.start).format('MMM DD, YYYY')}</Typography>
            <Typography color="textSecondary">Team: {event.team}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const Plantation = () => {
  const [view, setView] = useState(0);

  const handleChange = (event, newValue) => {
    setView(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Plantation Management</Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={view} onChange={handleChange}>
          <Tab label="Calendar View" />
          <Tab label="List View" />
        </Tabs>
      </Paper>

      {view === 0 ? (
        <Paper sx={{ p: 2, height: 600 }}>
          <Calendar
            localizer={localizer}
            events={plantationEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
          />
        </Paper>
      ) : (
        <PlantationList events={plantationEvents} />
      )}
    </Box>
  );
};

export default Plantation; 