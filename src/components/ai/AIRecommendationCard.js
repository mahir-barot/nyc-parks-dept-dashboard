import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, CardActionArea } from '@mui/material';
import Divider from '@mui/material/Divider';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// Sample tree images - you should add these to your assets folder
const treeImages = [
  '/tree-images/tree1.png',
  '/tree-images/tree2.png',
  '/tree-images/tree3.png'
];

const AIRecommendationCard = ({ srId, description, aiRecommendation, onClick, index }) => {
  // Use the index to select different images, fallback to first image if index is out of bounds
  const treeImage = treeImages[index % treeImages.length] || treeImages[0];

  const handleClick = () => {
    onClick({ srId, description, aiRecommendation, treeImage });
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
        <CardMedia
          component="img"
          height="340"
          image={treeImage}
          alt="Tree condition"
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            SR #{srId}
          </Typography>
          <Typography color="textSecondary" variant="body2" gutterBottom>
            {description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
            <SmartToyIcon color="primary" />
            <Typography variant="body1" color="primary" fontWeight={"bold"}>
              AI Recommendation:
            </Typography>
          </Box>
          <Divider sx={{ mt: 1 }} />
          <Typography variant="body2" sx={{ 
            mt: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',

            textOverflow: 'ellipsis'
          }}>
            {aiRecommendation}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default AIRecommendationCard; 