import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Box sx={{ p: 2 }}>
      <h4>Home</h4>
      <Link to={`/fixed-deposit`}>Fixed Deposit</Link>
      <br />
      <br />
      <Link to={`/fixed-deposit-calculator`}>Fixed Deposit Calculator</Link>
    </Box>
  );
}
