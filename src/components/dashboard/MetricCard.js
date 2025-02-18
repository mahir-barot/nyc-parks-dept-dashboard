import React from 'react';
import { Paper, Box, Typography, Icon } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const MetricCard = ({ title, value, trend, icon, color = '#2E7D32' }) => {
  const isPositive = trend >= 0;

  return (
    <Paper 
      sx={{ 
        p: 3, 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        }
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          p: 2,
          color: color,
          opacity: 0.1,
          transform: 'scale(2)',
        }}
      >
        <Icon sx={{ fontSize: 60 }}>{icon}</Icon>
      </Box>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h6" component="div" sx={{ mb: 2, color: 'text.secondary' }}>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isPositive ? (
            <TrendingUpIcon sx={{ color: 'success.main' }} />
          ) : (
            <TrendingDownIcon sx={{ color: 'error.main' }} />
          )}
          <Typography
            variant="body2"
            sx={{ 
              ml: 1, 
              color: isPositive ? 'success.main' : 'error.main',
              fontWeight: 'medium'
            }}
          >
            {Math.abs(trend)}% from last month
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default MetricCard; 