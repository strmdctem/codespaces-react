import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useMemo, useState } from 'react';
import FDFilterCalc from '../fd-filter/fd-filter-calc';
import { getBankViewData } from '../fd-view/data';
import { FDBankViewChart } from './fd-bank-view-chart';
import FDBankTable from './fd-bank-view-table';

const FDBankView = ({ name, backClick, calc }) => {
  const [calcValue, setCalcValue] = useState(calc || '50000');
  const data = useMemo(() => {
    return getBankViewData(name, calcValue);
  }, [name, calcValue]);

  const logoSrc = `./logos/${data.key}.svg`;

  const handleCalcChange = (value) => {
    setCalcValue(value);
    // onCalcChange(value);
  };

  return (
    <>
      <Box sx={{ p: 1 }}>
        <Stack direction="row" sx={{ px: 1 }} spacing={1}>
          <img className="logo-full" src={logoSrc} />
          <Typography variant="h6" gutterBottom>
            {data.name}
          </Typography>
          <Link className="back-link" onClick={backClick}>
            Back
          </Link>
        </Stack>
        <Stack direction="row" sx={{ height: 400 }} spacing={0}>
          <FDBankViewChart data={data.rates} />
        </Stack>

        {/* <Stack direction="row" sx={{ p: 2 }} spacing={4}>
          <span>{data.description}</span>
          <span>{data.establishedSince}</span>
        </Stack>
        <Stack direction="row" sx={{ px: 2 }} spacing={4}>
          <span>{data.protection}</span>
          <span>Compounding:{data.compounding}</span>
        </Stack> */}
        <Stack>
          <FDFilterCalc value={calcValue} onChange={handleCalcChange} />
        </Stack>
      </Box>
      <FDBankTable data={data.rates} />
    </>
  );
};

export default FDBankView;
