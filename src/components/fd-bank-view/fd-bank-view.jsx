import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import FDFilterCalc from '../fd-filter/fd-filter-calc';
import { getBankViewData } from '../fd-view/data';
import FDBankTable from './fd-bank-view-table';

const FDBankView = () => {
  const [calcValue, setCalcValue] = useState('50000');
  let { bankName } = useParams();
  let name = bankName;
  const data = useMemo(() => {
    return getBankViewData(name, calcValue);
  }, [name, calcValue]);

  const logoSrc = `/logos/${data.key}.svg`;

  const handleCalcChange = (value) => {
    setCalcValue(value);
    // onCalcChange(value);
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Paper elevation={4} sx={{ py: 1.5 }}>
          <Stack sx={{ marginLeft: 1.5 }} direction="row" spacing={1}>
            <img className="logo-full" src={logoSrc} />
            <Typography variant="subtitle2">{data.name}</Typography>
            <Stack direction="row" sx={{ justifyContent: 'flex-end', flex: 1 }}>
              <Stack className="i-since" direction="row" spacing={0.5}>
                <TodayOutlinedIcon fontSize="small" />
                <Typography variant="body2">
                  Since&nbsp;
                  {data.establishedSince}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1}>
            <VerifiedUserIcon sx={{ color: '#00c750' }} fontSize="small" />
            <Typography variant="body2">Insured {data.protection}</Typography>
          </Stack>
        </Paper>

        {/* <Stack direction="row" sx={{ p: 2 }} spacing={4}>
          <span>{data.description}</span>
          
        </Stack>
        <Stack direction="row" sx={{ px: 2 }} spacing={4}>
          <span>{data.protection}</span>
          <span>Compounding:{data.compounding}</span>
        </Stack> */}
        <br />
        <Stack>
          <FDFilterCalc value={calcValue} onChange={handleCalcChange} />
        </Stack>
      </Box>
      <FDBankTable data={data.rates} />
      {/* <Stack direction="row" sx={{ height: 400 }} spacing={0}>
        <FDBankViewChart data={data.rates} />
      </Stack> */}
    </>
  );
};

export default FDBankView;
