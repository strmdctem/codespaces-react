import {
  DescriptionOutlined,
  ExpandLess,
  ExpandMore,
  MailOutline
} from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BalanceIcon from '@mui/icons-material/Balance';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import CompareArrowsOutlined from '@mui/icons-material/CompareArrowsOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import StarIcon from '@mui/icons-material/Star';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { Backdrop, Collapse, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import bankMap from '../../data/bank-keys.json';
import SocialMediaLinks from '../social-media-links/social-media-links';
import SvgIcon from '../svg-icon/svg-icon';

export default function Navigation({ isOpen, onToggle }) {
  const theme = useTheme();
  // Use a single state variable to track which accordion is open
  // 'fd', 'home-loan', 'calculators', or null
  const [openAccordion, setOpenAccordion] = useState('fd');

  const handleFdMenuClick = () => {
    setOpenAccordion((prev) => (prev === 'fd' ? null : 'fd'));
  };
  const handleHomeLoanMenuClick = () => {
    setOpenAccordion((prev) => (prev === 'home-loan' ? null : 'home-loan'));
  };
  const handleCalculatorsMenuClick = () => {
    setOpenAccordion((prev) => (prev === 'calculators' ? null : 'calculators'));
  };
  const DrawerList = (
    <Box
      sx={{
        width: 250,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.default
      }}
    >
      {/* Scrollable navigation list */}
      <Box sx={{ flex: 1, overflowY: 'auto', pb: 7 }}>
        <List>
          {/* Fixed Deposit Section */}
          <ListItem
            key="fixed-deposit"
            disablePadding={true}
            sx={{ display: 'block' }}
          >
            <ListItemButton
              onClick={handleFdMenuClick}
              selected={openAccordion === 'fd'}
              sx={{ minHeight: 48, px: 2, borderRadius: 2 }} // Standard mobile size
            >
              <SavingsOutlinedIcon
                fontSize="small"
                sx={{
                  mr: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  borderRadius: 1,
                  p: 0.5
                }}
              />
              <ListItemText primary="Fixed Deposit" sx={{ fontSize: '1rem' }} />
              {openAccordion === 'fd' ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openAccordion === 'fd'} timeout="auto">
              <List disablePadding>
                <ListItem key="calculate-and-compare" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/fixed-deposit/calculator`}
                      className="menu-link"
                    >
                      <TableChartOutlinedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.info.main, 0.12),
                          color: theme.palette.info.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="Calculate & Compare"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="highest-rates" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/fixed-deposit/view/highest-rates`}
                      className="menu-link"
                    >
                      <StarIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.warning.main, 0.12),
                          color: theme.palette.warning.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="Highest Rates"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="specific-tenure-rates" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/fixed-deposit/view/specific-tenures`}
                      className="menu-link"
                    >
                      <TrackChangesOutlinedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.success.main, 0.12),
                          color: theme.palette.success.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="Specific Tenure Rates"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="all-rates" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link to={`fixed-deposit/view/all`} className="menu-link">
                      <TableChartOutlinedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="All Rates"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <Divider sx={{ ml: 3 }} />
                <ListItem>
                  <List
                    disablePadding
                    sx={{ maxHeight: 220, overflow: 'auto' }} // Increased maxHeight for better scroll area
                  >
                    {bankMap.map((bank) => (
                      <ListItem
                        className="bank-list-item"
                        key={bank.key}
                        disablePadding
                        dense={true}
                      >
                        <ListItemButton onClick={onToggle}>
                          <Link
                            to={`/fixed-deposit/${bank.key}`}
                            title={`FD Rates and Calculator for ${bank.name}`}
                            aria-label={`Fixed Deposit Rates and Calculator for ${bank.name}`}
                          >
                            <SvgIcon className="logo" accessKey={bank.key} />
                            <ListItemText primary={bank.name} />
                          </Link>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </ListItem>
                <Divider sx={{ ml: 3 }} />
              </List>
            </Collapse>
          </ListItem>
          {/* Home Loan Section */}
          <ListItem
            key="home-loan"
            disablePadding={true}
            sx={{ display: 'block' }}
          >
            <ListItemButton
              onClick={handleHomeLoanMenuClick}
              selected={openAccordion === 'home-loan'}
              sx={{ minHeight: 48, px: 2, borderRadius: 2 }} // Standard mobile size
            >
              <HomeWorkOutlinedIcon
                fontSize="small"
                sx={{
                  mr: 1,
                  bgcolor: alpha(theme.palette.secondary.main, 0.12),
                  color: theme.palette.secondary.main,
                  borderRadius: 1,
                  p: 0.5
                }}
              />
              <ListItemText primary="Loan" sx={{ fontSize: '1rem' }} />
              {openAccordion === 'home-loan' ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openAccordion === 'home-loan'} timeout="auto">
              <List disablePadding>
                <ListItem key="home-loan-comparison" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link to={`/home-loan/comparison`} className="menu-link">
                      <HomeWorkOutlinedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="Home Loan Comparison"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="emi-calculator" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/emi-calculator`}
                      className="menu-link"
                    >
                      <AccountBalanceIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.info.main, 0.12),
                          color: theme.palette.info.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="EMI Calculator"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem
                  key="loan-rate-change-calculator"
                  disablePadding={true}
                >
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/loan-rate-change-calculator`}
                      className="menu-link"
                    >
                      <CompareArrowsOutlined
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.info.main, 0.12),
                          color: theme.palette.info.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="Loan Rate Change"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem
                  key="loan-prepay-vs-investment-calculator"
                  disablePadding={true}
                >
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/loan-prepay-vs-investment-calculator`}
                      className="menu-link"
                    >
                      <BalanceIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.info.main, 0.12),
                          color: theme.palette.info.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="Loan Prepay vs Invest"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </ListItem>
          {/* Calculators Section */}
          <ListItem
            key="calculators"
            disablePadding={true}
            sx={{ display: 'block' }}
          >
            <ListItemButton
              onClick={handleCalculatorsMenuClick}
              selected={openAccordion === 'calculators'}
              sx={{ minHeight: 48, px: 2, borderRadius: 2 }} // Standard mobile size
            >
              <CalculateOutlinedIcon
                fontSize="small"
                sx={{
                  mr: 1,
                  bgcolor: alpha(theme.palette.success.main, 0.12),
                  color: theme.palette.success.main,
                  borderRadius: 1,
                  p: 0.5
                }}
              />
              <ListItemText primary="Calculators" sx={{ fontSize: '1rem' }} />
              {openAccordion === 'calculators' ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItemButton>
            <Collapse in={openAccordion === 'calculators'} timeout="auto">
              <List disablePadding sx={{ maxHeight: 220, overflow: 'auto' }}>
                <ListItem key="fd-calculator" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/fixed-deposit/calculator`}
                      className="menu-link"
                    >
                      <TableChartOutlinedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="FD Calculator"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem
                  key="loan-rate-change-calculator"
                  disablePadding={true}
                >
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/loan-rate-change-calculator`}
                      className="menu-link"
                    >
                      <CompareArrowsOutlined
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.info.main, 0.12),
                          color: theme.palette.info.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="Loan Rate Change"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="emi-calculator" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/emi-calculator`}
                      className="menu-link"
                    >
                      <AccountBalanceIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.info.main, 0.12),
                          color: theme.palette.info.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="EMI Calculator"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="sip-calculator" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/sip-calculator`}
                      className="menu-link"
                    >
                      <TrendingUpOutlinedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.success.main, 0.12),
                          color: theme.palette.success.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="SIP Calculator"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="goal-calculator" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/goal-calculator`}
                      className="menu-link"
                    >
                      <TrackChangesOutlinedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.warning.main, 0.12),
                          color: theme.palette.warning.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="Goal Calculator"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="interest-calculator" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/interest-calculator`}
                      className="menu-link"
                    >
                      <PercentOutlinedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.error.main, 0.12),
                          color: theme.palette.error.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="Interest Calculator"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="ppf-calculator" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/ppf-calculator`}
                      className="menu-link"
                    >
                      <AccountBalanceWalletIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="PPF Calculator"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="stp-calculator" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/stp-calculator`}
                      className="menu-link"
                    >
                      <InsightsOutlinedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.secondary.main, 0.12),
                          color: theme.palette.secondary.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="STP Calculator"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="swp-calculator" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/swp-calculator`}
                      className="menu-link"
                    >
                      <InsightsOutlinedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.success.main, 0.12),
                          color: theme.palette.success.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="SWP Calculator"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem
                  key="loan-prepay-vs-investment-calculator"
                  disablePadding={true}
                >
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/loan-prepay-vs-investment-calculator`}
                      className="menu-link"
                    >
                      <BalanceIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.info.main, 0.12),
                          color: theme.palette.info.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="Loan Prepay vs Invest"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </ListItem>
          {/* Government Schemes Section */}
          <ListItem
            key="government-schemes-section"
            disablePadding={true}
            sx={{ display: 'block' }}
          >
            <ListItemButton
              onClick={() =>
                setOpenAccordion(
                  openAccordion === 'government-schemes'
                    ? null
                    : 'government-schemes'
                )
              }
              selected={openAccordion === 'government-schemes'}
              sx={{ minHeight: 48, px: 2, borderRadius: 2 }} // Standard mobile size
            >
              <AccountBalanceIcon
                fontSize="small"
                sx={{
                  mr: 1,
                  bgcolor: alpha(theme.palette.warning.main, 0.12),
                  color: theme.palette.warning.main,
                  borderRadius: 1,
                  p: 0.5
                }}
              />
              <ListItemText
                primary="Government Schemes"
                sx={{ fontSize: '1rem' }}
              />
              {openAccordion === 'government-schemes' ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItemButton>
            <Collapse
              in={openAccordion === 'government-schemes'}
              timeout="auto"
            >
              <List disablePadding>
                <ListItem key="gov-schemes-comparison" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/government-schemes/comparison`}
                      className="menu-link"
                    >
                      <AccountBalanceIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.warning.main, 0.12),
                          color: theme.palette.warning.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="Schemes Comparison"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="fd-calculator" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/fixed-deposit/calculator`}
                      className="menu-link"
                    >
                      <TableChartOutlinedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="FD Calculator"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                <ListItem key="ppf-calculator" disablePadding={true}>
                  <ListItemButton
                    onClick={onToggle}
                    sx={{ minHeight: 44, px: 0.5, borderRadius: 2, pl: 3 }}
                  >
                    <Link
                      to={`/calculators/ppf-calculator`}
                      className="menu-link"
                    >
                      <AccountBalanceWalletIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.main,
                          borderRadius: 1,
                          p: 0.5
                        }}
                      />
                      <ListItemText
                        primary="PPF Calculator"
                        sx={{ fontSize: '0.97rem' }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                {/* Add more related calculators here if needed */}
              </List>
            </Collapse>
          </ListItem>
          {/* Investment Options Section */}
          <ListItem
            key="investment-options"
            disablePadding={true}
            sx={{ display: 'block' }}
          >
            <ListItemButton onClick={onToggle}>
              <Link
                to={`/non-equity-investment-options-analyzer`}
                className="menu-link"
              >
                <InsightsOutlinedIcon
                  fontSize="small"
                  sx={{
                    mr: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    borderRadius: 1,
                    p: 0.5
                  }}
                />
                <ListItemText primary="Investment Options" />
              </Link>
            </ListItemButton>
          </ListItem>
          {/* Static Links */}
          <ListItem
            key="disclaimer"
            disablePadding
            dense={true}
            sx={{ display: 'block' }}
          >
            <ListItemButton onClick={onToggle}>
              <Link to={`/disclaimer`} className="menu-link">
                <DescriptionOutlined
                  fontSize="small"
                  sx={{
                    mr: 1,
                    bgcolor: alpha(theme.palette.info.main, 0.12),
                    color: theme.palette.info.main,
                    borderRadius: 1,
                    p: 0.5
                  }}
                />
                <ListItemText primary="Disclaimer" />
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem
            key="privacy-policy"
            disablePadding
            dense={true}
            sx={{ display: 'block' }}
          >
            <ListItemButton onClick={onToggle}>
              <Link to={`/privacy-policy`} className="menu-link">
                <DescriptionOutlined
                  fontSize="small"
                  sx={{
                    mr: 1,
                    bgcolor: alpha(theme.palette.secondary.main, 0.12),
                    color: theme.palette.secondary.main,
                    borderRadius: 1,
                    p: 0.5
                  }}
                />
                <ListItemText primary="Privacy Policy" />
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem
            key="contact-us"
            disablePadding
            dense={true}
            sx={{ display: 'block' }}
          >
            <ListItemButton onClick={onToggle}>
              <Link to={`/contact-us`} className="menu-link">
                <MailOutline
                  fontSize="small"
                  sx={{
                    mr: 1,
                    bgcolor: alpha(theme.palette.success.main, 0.12),
                    color: theme.palette.success.main,
                    borderRadius: 1,
                    p: 0.5
                  }}
                />
                <ListItemText primary="Contact us" />
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem
            key="about-us"
            disablePadding
            dense={true}
            sx={{ display: 'block' }}
          >
            <ListItemButton onClick={onToggle}>
              <Link to={`/about-us`} className="menu-link">
                <DescriptionOutlined
                  fontSize="small"
                  sx={{
                    mr: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    borderRadius: 1,
                    p: 0.5
                  }}
                />
                <ListItemText primary="About Us" />
              </Link>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      {/* Sticky social links at the bottom */}
      <Box
        sx={{
          p: 2,
          paddingTop: 2.5
        }}
      >
        <SocialMediaLinks />
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer open={isOpen} onClose={onToggle} variant="persistent">
        {DrawerList}
      </Drawer>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
        open={isOpen}
        onClick={onToggle}
      />
    </>
  );
}
