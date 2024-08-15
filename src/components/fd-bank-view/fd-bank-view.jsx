import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import FDCalculatorForm from '../fd-calculator/fd-calculator-form';
import { getBankViewData, getCalcData } from '../fd-view/data';
import { FDBankViewChart } from './fd-bank-view-chart';
import FDBankTable from './fd-bank-view-table';

const FDBankView = () => {
  const [calcState, setCalcState] = useState({});
  let { bankName } = useParams();
  let name = bankName;
  const interestRef = useRef();
  const data = useMemo(() => {
    return getBankViewData(name, calcState.amount);
  }, [name, calcState.amount]);
  const chartData = useMemo(() => {
    if (!calcState.banks) return;
    const newData = getCalcData(calcState)[0];
    interestRef.current = newData.general;
    console.log('calc chart data', newData);
    const requiredData = {
      principal: Number(calcState.amount),
      interest: newData.general_value
    };
    console.log('chart data', requiredData);
    return requiredData;
  }, [calcState]);

  const logoSrc = `/logos/${data.key}.svg`;

  const handleCalcChange = (state) => {
    state.banks = [name];
    setCalcState(state);
    console.log('new state', state);
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
              <AccountBalanceIcon fontSize="small" />
              <Typography variant="body2">
                Regulated by the RBI&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Typography>
            </Stack>
          </Stack>
        </Paper>
        <br />
        <Paper elevation={2}>
          <FDCalculatorForm
            onChange={handleCalcChange}
            showBankSelector={false}
          />
          <Stack
            direction="row"
            sx={{ marginTop: -5, marginLeft: 2 }}
            spacing={3}
          >
            <label className="calc-label"> Interest:</label>
            <Typography variant="body1">{interestRef.current}%</Typography>
          </Stack>
          <Stack direction="row" sx={{ height: 300 }} spacing={0}>
            <FDBankViewChart data={chartData} />
          </Stack>
        </Paper>
      </Box>
      <FDBankTable data={data.rates} />
    </>
  );
};

export default FDBankView;
