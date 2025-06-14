import { Typography } from '@mui/material';

const FooterMessage = ({ size = 'large' }) => {
  const isLarge = size === 'large';

  return (
    <Typography
      variant={isLarge ? 'body1' : 'body2'}
      color="text.secondary"
      sx={{
        display: 'block',
        fontWeight: 400,
        letterSpacing: 0.25,
        fontSize: isLarge
          ? { xs: '0.875rem', sm: '1rem' }
          : { xs: '0.75rem', sm: '0.875rem' },
        textAlign: 'center'
      }}
    >
      Built with
      <span
        style={{
          color: '#e25555',
          fontSize: '1.2em',
          verticalAlign: 'middle'
        }}
      >
        &nbsp;&hearts;&nbsp;
      </span>
      in India - Always Free for Everyone
    </Typography>
  );
};

export default FooterMessage;
