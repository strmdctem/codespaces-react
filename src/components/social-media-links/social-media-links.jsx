import { Typography } from '@mui/material';

const SocialMediaLinks = () => {
  return (
    <>
      <div
        style={{
          display: 'flex', // Flexbox for horizontal alignment
          gap: '12px', // Space between logos
          alignItems: 'center', // Vertically align items
          justifyContent: 'center', // Center align horizontally
          width: '100%' // Ensure it takes full width of parent
        }}
      >
        <a
          href="https://www.instagram.com/finratesindia"
          target="_blank"
          rel="noopener noreferrer"
          className="menu-link"
          style={{
            display: 'inline-flex',
            width: 24,
            height: 24,
            marginRight: 12
          }}
        >
          <img
            src="/instagram.svg"
            alt="Instagram"
            style={{ width: 36, height: 36 }}
          />
        </a>
        <a
          href="https://x.com/finratesindia"
          target="_blank"
          rel="noopener noreferrer"
          className="menu-link"
          style={{ display: 'inline-flex', width: 24, height: 24, mt: 1 }}
        >
          <img src="/x.svg" alt="X" style={{ width: 32, height: 32 }} />
        </a>
      </div>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          mt: 1, // Reduce margin top for less gap
          display: 'block',
          fontWeight: 500,
          letterSpacing: 1,
          fontSize: { xs: '0.875rem', sm: '1rem' },
          textAlign: 'center'
        }}
      >
        Made with
        <span
          style={{
            color: '#e25555',
            fontSize: '1.2em',
            verticalAlign: 'middle'
          }}
        >
          &hearts;
        </span>
        in India
      </Typography>
    </>
  );
};

export default SocialMediaLinks;
