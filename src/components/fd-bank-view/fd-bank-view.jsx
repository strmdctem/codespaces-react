import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Paper, Slider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import FDFilterCalc from '../fd-filter/fd-filter-calc';
import { getBankViewData } from '../fd-view/data';
import { FDBankViewChart } from './fd-bank-view-chart';
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
      <Box sx={{ p: 2 }} className="i-card">
        <Paper elevation={5} sx={{ py: 2 }}>
          <Stack sx={{ marginLeft: 2 }} direction="row" spacing={1}>
            <img className="logo-full" src={logoSrc} />
            <Typography className="i-name" variant="subtitle2">
              {data.name}
            </Typography>
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
          <Stack sx={{ marginLeft: 2, marginTop: 1.5 }} spacing={0.5}>
            <Typography className="i-value" variant="h6">
              Highest Rate: 8.5%
            </Typography>
            <Typography variant="body2">Min Amount:&nbsp; ₹10,000</Typography>
            <Typography variant="body2">
              Tenure:&nbsp; 7 Days to 5 Years
            </Typography>
          </Stack>
          <Stack sx={{ alignItems: 'flex-end', px: 1, marginTop: 2 }}>
            <Stack sx={{ marginTop: 1 }} direction="row" spacing={1}>
              <VerifiedUserIcon sx={{ color: '#00c750' }} fontSize="small" />
              <Typography variant="body2">DICGC Insured upto 5 lacs</Typography>
            </Stack>
            <Stack sx={{ marginTop: 1 }} direction="row" spacing={1}>
              <AccountBalanceIcon sx={{ color: '#13044f' }} fontSize="small" />
              <Typography variant="body2">
                Regulated by the RBI&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Typography>
            </Stack>
          </Stack>
        </Paper>
        <br />
        <Paper elevation={2} sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <label className="calc-label"> Amount:</label>
            <FDFilterCalc
              style={{ width: '100%' }}
              value={calcValue}
              onChange={handleCalcChange}
            />
          </Stack>
          <Stack direction="row" spacing={4} sx={{ marginTop: 3 }}>
            <label className="calc-label">Tenure:</label>
            <Stack style={{ width: '100%' }}>
              <div style={{ marginTop: '-10px' }}>
                <Slider
                  value={30}
                  valueLabelDisplay="off"
                  step={1}
                  min={1}
                  max={60}
                />
              </div>
            </Stack>
          </Stack>
          <Stack direction="row" sx={{ height: 300 }} spacing={0}>
            <FDBankViewChart data={data.rates} />
          </Stack>
        </Paper>
      </Box>
      <FDBankTable data={data.rates} />
    </>
  );
};

export default FDBankView;
