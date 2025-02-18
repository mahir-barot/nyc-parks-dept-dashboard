import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AIRecommendationModal = ({ open, onClose, recommendation }) => {
  if (!recommendation) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionProps={{
        enter: true,
        timeout: 500
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <SmartToyIcon />
        AI Detailed Analysis
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src={recommendation.treeImage}
            alt="Tree condition"
            sx={{
              width: '100%',
              maxHeight: 300,
              objectFit: 'cover',
              borderRadius: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Service Request #{recommendation.srId}
          </Typography>
          <Chip 
            label={`Risk Level: ${recommendation.riskLevel || 'Medium'}`}
            color={recommendation.riskLevel === 'High' ? 'error' : 'warning'}
            icon={<PriorityHighIcon />}
            sx={{ mr: 1 }}
          />
          <Chip 
            label={`Priority: ${recommendation.priority || 'Normal'}`}
            color="primary"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon color="primary" />
            Location Details
          </Typography>
          <Typography variant="body1">
            {recommendation.location || 'Location information not available'}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Issue Description
          </Typography>
          <Typography variant="body1">
            {recommendation.description}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
            AI Recommendation
          </Typography>
          <Typography variant="body1" sx={{ 
            bgcolor: 'primary.light',
            color: 'white',
            p: 2,
            borderRadius: 1
          }}>
            {recommendation.aiRecommendation}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon fontSize="small" />
            Estimated Timeline: {recommendation.timeline || '7-14 days'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={onClose}
        >
          Create Work Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIRecommendationModal; 