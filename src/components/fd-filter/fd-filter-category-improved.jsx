import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { alpha, useTheme } from '@mui/material/styles';
import { FD_CATEGORIES } from './fd-filter-constants';

// Icons for visual enhancement
import ElderlySeniorIcon from '@mui/icons-material/ElderlySenior';
import PersonIcon from '@mui/icons-material/Person';

export default function FDFilterCategoryImproved({ value, onChange }) {
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    if (newValue !== null) onChange(newValue);
  };

  const categoryIcons = {
    false: <PersonIcon fontSize="small" />,
    true: <ElderlySeniorIcon fontSize="small" />
  };

  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      value={value}
      onChange={handleChange}
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 1,
        '& .MuiToggleButton-root': {
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            borderColor: theme.palette.primary.main
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark
            }
          }
        }
      }}
    >
      {FD_CATEGORIES.map(({ value: categoryValue, label }) => (
        <ToggleButton
          key={categoryValue}
          value={categoryValue}
          sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}
        >
          {categoryIcons[categoryValue]}
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
