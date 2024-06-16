import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { getBankRates } from '../fd-view/data';
import FDBankTable from './table';

const FDBankView = ({ name, backClick }) => {
  const data = useMemo(() => {
    return getBankRates(name);
  });

  return (
    <>
      <Typography variant="subtitle1" sx={{ m: 2 }}>
        {name} &nbsp;&nbsp;
        <Link onClick={backClick}>Back</Link>
      </Typography>
      <FDBankTable data={data} />
    </>
  );
};

export default FDBankView;
