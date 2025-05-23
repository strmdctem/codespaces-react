import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import usePageInfo from '../page-info/use-page-info';

export default function AboutUs() {
  usePageInfo({ title: 'About Us' });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        About Us
      </Typography>

      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Our Mission
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        We are a team of professionals dedicated to simplifying financial
        information for everyone. At FinRates, our mission is to provide
        accurate, up-to-date information on various financial products and
        empower users to make informed financial decisions through transparent
        comparison tools and calculators.
      </Typography>

      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        What We Offer
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        FinRates brings you comprehensive tools to navigate India's complex
        financial landscape:
        <ul>
          <li>Latest Fixed Deposit rates from major banks and NBFCs</li>
          <li>
            Advanced financial calculators for EMI, SIP, and goal planning
          </li>
          <li>Easy-to-use comparison tools for investment options</li>
          <li>Educational resources to improve financial literacy</li>
        </ul>
        All our tools are designed to be intuitive, accurate, and completely
        free to use.
      </Typography>

      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Our Values
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        <strong>Transparency:</strong> We believe in complete transparency in
        financial information.
        <br />
        <strong>Accuracy:</strong> We strive to provide the most accurate and
        up-to-date information.
        <br />
        <strong>Accessibility:</strong> Financial tools should be accessible to
        everyone, regardless of their financial background.
        <br />
        <strong>Privacy:</strong> We respect your privacy and do not collect
        personal data.
      </Typography>

      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Our Team
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        Behind FinRates is a dedicated team of professionals who are passionate
        about making financial information accessible to everyone.
      </Typography>

      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Our Commitment
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 3 }}>
        We are committed to continuous improvement. We regularly update our
        data, enhance our calculators, and optimize our user experience based on
        feedback. Our goal is to be your trusted companion in all financial
        decisions, from choosing the right fixed deposit to planning for
        long-term financial goals.
      </Typography>

      <Typography variant="body2" sx={{ marginTop: 4, fontStyle: 'italic' }}>
        Have questions or suggestions? We'd love to hear from you! Reach out to
        us through our{' '}
        <a href="/contact-us" style={{ textDecoration: 'none' }}>
          Contact Us
        </a>{' '}
        page.
      </Typography>
    </Box>
  );
}
