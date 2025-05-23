import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import usePageInfo from '../page-info/use-page-info';

export default function PrivacyPolicy() {
  usePageInfo({ title: 'Privacy Policy' });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Privacy Policy
      </Typography>{' '}
      <Typography variant="subtitle2" sx={{ marginBottom: 2 }}>
        At FinRates, your privacy is important to us. This Privacy Policy
        outlines how we handle your information when you use our app and
        website.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Data Collection
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        {' '}
        <b>
          We do not collect any type of data through our app or website.
        </b>{' '}
        All data related to your usage, such as comparison history, calculator
        inputs, and saved portfolios, is stored locally on your device and is
        not transmitted to our servers.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Use of Google Analytics
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        {' '}
        We use Google Analytics to track and analyze traffic and usage patterns.
        This helps us improve the user experience and optimize our services.
        Google Analytics collects anonymized data, such as your device type,
        browser type, and pages visited. This data does not identify you
        personally.
        <br />
        For more information on how Google Analytics collects and processes
        data, please visit &nbsp;
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google’s Privacy Policy
        </a>
        .
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Changes to This Privacy Policy
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        We reserve the right to update this Privacy Policy at any time. Any
        changes will be reflected on this page. We encourage you to review this
        Privacy Policy periodically to stay informed about how we protect your
        privacy.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Contact Us
      </Typography>
      <Typography variant="body2">
        {' '}
        If you have any questions or concerns about this Privacy Policy, please{' '}
        <Link to={`/contact-us`}>Contact us</Link>.
      </Typography>
    </Box>
  );
}
