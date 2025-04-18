import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import {
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FDCalculatorForm from '../fd-calculator/fd-calculator-form';
import { getBankViewData, getCalcData } from '../fd-view/data';
import usePageInfo from '../page-info/use-page-info';
import SvgIcon from '../svg-icon/svg-icon';
import { FDBankViewChart } from './fd-bank-view-chart';
import FDBankTable from './fd-bank-view-table';

const FDBankView = () => {
  const [calcState, setCalcState] = useState({});
  const [category, setCategory] = useState('general');
  let { bankName } = useParams();
  let name = bankName;
  const interestRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setCalcState((prevState) => ({
      ...prevState,
      banks: [name]
    }));
  }, [name]);
  const data = useMemo(() => {
    return getBankViewData(name, calcState.amount);
  }, [name, calcState.amount]);

  useEffect(() => {
    if (!data || data.length === 0) {
      navigate(-1);
    }
  }, [data, navigate]);

  usePageInfo({
    title: `${data.shortName} FD Rates and Calculator`,
    description: `${data.name} - Check the latest fixed deposit interest rates of 2025 and use FinRates calculator to know returns on your savings.`
  });

  const chartData = useMemo(() => {
    if (!calcState.banks) return;
    const newData = getCalcData(calcState)[0];
    interestRef.current = newData[category];
    const requiredData = {
      principal: Number(calcState.amount),
      interest: newData[`${category}_value`]
    };
    return requiredData;
  }, [calcState, category]);

  const isTop = (rate) => {
    if (!rate) return false;
    return data.rates.some((item) => {
      if (category === 'general') {
        return item.general_isTop && item.general == rate;
      } else {
        return item.senior_isTop && item.senior == rate;
      }
    });
  };

  const handleCalcChange = (state) => {
    state.banks = [name];
    setCalcState(state);
  };

  const handleCategoryChange = (event, value) => {
    setCategory(value);
  };

  return (
    <>
      <Box sx={{ p: 2 }} className="i-card">
        <Paper elevation={5} sx={{ py: 2 }}>
          <Stack
            sx={{ marginLeft: 2, marginTop: -1 }}
            direction="row"
            spacing={1}
          >
            <SvgIcon className="logo-full" accessKey={data.key} />
            <Typography
              className="i-name"
              variant="h1"
              sx={{ paddingTop: 0.2 }}
            >
              {data.name} FD
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
          <Divider sx={{ marginTop: 0.5 }} />
          <Stack sx={{ marginLeft: 2, marginTop: 1.5 }} spacing={0.5}>
            <Typography variant="body2">
              Tenure range:&nbsp; <b>{data.tenureLabel}</b>
            </Typography>
            <Typography variant="body2">
              General rate:&nbsp;&nbsp; <b>{data.ratesGeneralLabel}</b>
            </Typography>
            <Typography variant="body2">
              Senior rate:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b>{data.ratesSeniorLabel}</b>
            </Typography>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Stack sx={{ px: 1, marginTop: 2 }}>
              {data.type === 'NBFC' ? (
                <Stack sx={{ marginTop: 1 }} direction="row" spacing={1}>
                  <WorkspacePremiumIcon fontSize="medium" />
                  <Typography
                    variant="body2"
                    sx={{ marginTop: '2px !important' }}
                  >
                    {data.rating} Rated
                  </Typography>
                </Stack>
              ) : (
                <Stack sx={{ marginTop: 1 }} direction="row" spacing={1}>
                  <VerifiedUserIcon
                    sx={{ color: '#00c750', marginLeft: '2px !important' }}
                    fontSize="small"
                  />
                  <Typography variant="body2">
                    DICGC Insured upto 5 lacs &nbsp;&nbsp;
                  </Typography>
                </Stack>
              )}

              <Stack
                sx={{ marginTop: 1, paddingLeft: '2px' }}
                direction="row"
                spacing={1}
              >
                <AccountBalanceIcon fontSize="small" />
                <Typography variant="body2">
                  Regulated by the RBI&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Paper>
        <br />
        <Paper elevation={2}>
          <Typography
            component="h2"
            variant="subtitle1"
            sx={{ fontWeight: 'bold', paddingLeft: 2, paddingTop: 1 }}
          >
            {data.shortName} FD Calculator
          </Typography>
          <FDCalculatorForm
            onChange={handleCalcChange}
            showBankSelector={false}
          />
          <Stack
            direction="row"
            sx={{ marginTop: -2, marginLeft: 2, marginBottom: 2 }}
            spacing={3}
          >
            <label className="calc-label"> Category:</label>
            <Box
              sx={{
                marginTop: '-9px !important',
                marginLeft: '14px !important'
              }}
            >
              <RadioGroup
                row
                name="row-radio-buttons-group"
                value={category}
                onChange={handleCategoryChange}
              >
                <FormControlLabel
                  sx={{ fontSize: '0.85rem' }}
                  disableTypography={true}
                  value="general"
                  control={<Radio size="small" />}
                  label="General"
                />
                <FormControlLabel
                  sx={{ fontSize: '0.90rem' }}
                  disableTypography={true}
                  value="senior"
                  control={<Radio size="small" />}
                  label="Senior Citizen"
                />
              </RadioGroup>
            </Box>
          </Stack>
          <Stack direction="row" sx={{ marginLeft: 2 }} spacing={3}>
            <label className="calc-label"> Interest:</label>
            <Typography
              fontWeight={'bold'}
              variant="body1"
              className={isTop(interestRef.current) ? 'isTop' : 'NotTop'}
            >
              {interestRef.current
                ? `${interestRef.current}%`
                : 'Not Available'}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ height: 320 }} spacing={0}>
            <FDBankViewChart data={chartData} />
          </Stack>
        </Paper>
      </Box>
      <Typography
        component="h2"
        variant="subtitle1"
        sx={{ fontWeight: 'bold', paddingLeft: 2 }}
      >
        {data.shortName} Fixed Deposit Interest Rates
      </Typography>
      <Stack direction="row" justifyContent="flex-end">
        <Typography variant="body2" sx={{ pr: 2 }}>
          G = General, S = Senior Citizen
        </Typography>
      </Stack>
      <FDBankTable data={data.rates} />
    </>
  );
};

export default FDBankView;
