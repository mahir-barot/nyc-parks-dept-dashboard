import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

// Define fade-out animation
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

const Preloader = ({ isLoading }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#2E7D32', // Light green color matching your theme
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: isLoading ? 'none' : `${fadeOut} 0.5s ease-out forwards`,
      }}
    >
      <img 
        src="/logo.png" 
        alt="ForMS Logo" 
        style={{ 
          width: '250px', 
          marginBottom: '20px',
          animation: 'pulse 2s infinite',
          borderRadius: '1000px'
        }} 
      />
      <Typography
        variant="h2"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        ForMS 3.0
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          mt: 2,
          opacity: 0.9,
        }}
      >
        Developed by UCI.
      </Typography>
    </Box>
  );
};

export default Preloader; 