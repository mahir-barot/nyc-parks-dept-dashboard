import React from 'react';
import { Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import RecommendIcon from '@mui/icons-material/Recommend';

const recommendations = [
  'Schedule pruning for oak trees in Central Park',
  'Plant drought-resistant species in Riverside Park',
  'Monitor maple trees for early signs of disease',
];

const AIRecommendationsWidget = () => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Latest AI Insights</Typography>
      <List>
        {recommendations.map((rec, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <RecommendIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={rec} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default AIRecommendationsWidget; 