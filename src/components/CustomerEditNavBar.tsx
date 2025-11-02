import { Box, Button } from '@mui/material';
import {
  DirectionsCar as MezziIcon,
  Business as SediIcon,
  Contacts as ContattiIcon,
} from '@mui/icons-material';

interface CustomerEditNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CustomerEditNavBar = ({ activeTab, onTabChange }: CustomerEditNavBarProps) => {
  const tabs = [
    { id: 'mezzi', label: 'Mezzi', icon: <MezziIcon /> },
    { id: 'sedi', label: 'SEDI', icon: <SediIcon /> },
    { id: 'contatti', label: 'Contatti', icon: <ContattiIcon /> },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        borderBottom: '2px solid #ddd',
        pb: 1,
      }}
    >
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? 'contained' : 'outlined'}
          startIcon={tab.icon}
          onClick={() => onTabChange(tab.id)}
          sx={{
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '11px',
            minWidth: '120px',
            ...(activeTab === tab.id
              ? {
                  backgroundColor: '#93c54b',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#7db33c',
                  },
                }
              : {
                  borderColor: '#93c54b',
                  color: '#93c54b',
                  '&:hover': {
                    borderColor: '#7db33c',
                    backgroundColor: 'rgba(147, 197, 75, 0.08)',
                  },
                }),
          }}
        >
          {tab.label}
        </Button>
      ))}
    </Box>
  );
};

export default CustomerEditNavBar;
