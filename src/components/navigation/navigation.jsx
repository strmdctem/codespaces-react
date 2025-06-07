import {
  DescriptionOutlined,
  ExpandLess,
  ExpandMore,
  MailOutline
} from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { Backdrop, Collapse, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import bankMap from '../../data/bank-keys.json';
import SocialMediaLinks from '../social-media-links/social-media-links';
import SvgIcon from '../svg-icon/svg-icon';

export default function Navigation({ isOpen, onToggle }) {
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
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem
          key="fixed-deposit"
          disablePadding={true}
          dense={true}
          sx={{ display: 'block' }}
        >
          <ListItemButton
            onClick={handleFdMenuClick}
            selected={openAccordion === 'fd'}
          >
            <SavingsOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText primary="Fixed Deposit" />
            {openAccordion === 'fd' ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openAccordion === 'fd'} timeout="auto">
            <List disablePadding>
              <ListItem
                key="calculate-and-compare"
                disablePadding={true}
                dense={true}
              >
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link to={`/fixed-deposit/calculator`} className="menu-link">
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Calculate & Compare" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem key="highest-rates" disablePadding={true} dense={true}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/fixed-deposit/view/highest-rates`}
                    className="menu-link"
                  >
                    <TableChartOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Highest Rates" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem
                key="specific-tenure-rates"
                disablePadding={true}
                dense={true}
              >
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/fixed-deposit/view/specific-tenures`}
                    className="menu-link"
                  >
                    <TableChartOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Specific Tenure Rates" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem key="all-rates" disablePadding={true} dense={true}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link to={`fixed-deposit/view/all`} className="menu-link">
                    <TableChartOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="All Rates" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <Divider sx={{ ml: 3 }} />
              <ListItem>
                <List disablePadding sx={{ maxHeight: 160, overflow: 'auto' }}>
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
          dense={true}
          sx={{ display: 'block' }}
        >
          <ListItemButton
            onClick={handleHomeLoanMenuClick}
            selected={openAccordion === 'home-loan'}
          >
            <HomeWorkOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText primary="Home Loan" />
            {openAccordion === 'home-loan' ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openAccordion === 'home-loan'} timeout="auto">
            <List disablePadding>
              <ListItem
                key="home-loan-comparison"
                disablePadding={true}
                dense={true}
              >
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link to={`/home-loan/comparison`} className="menu-link">
                    <HomeWorkOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Home Loan Comparison" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem key="emi-calculator" disablePadding={true} dense={true}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/emi-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="EMI Calculator" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem
                key="loan-rate-change-calculator"
                disablePadding={true}
                dense={true}
              >
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/loan-rate-change-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Loan Rate Change" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem
                key="loan-prepay-vs-investment-calculator"
                disablePadding={true}
                dense={true}
              >
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/loan-prepay-vs-investment-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Loan Prepay vs Invest" />
                  </Link>
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </ListItem>
        <ListItem
          key="calculators"
          disablePadding={true}
          dense={true}
          sx={{ display: 'block' }}
        >
          <ListItemButton
            onClick={handleCalculatorsMenuClick}
            selected={openAccordion === 'calculators'}
          >
            <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText primary="Calculators" />
            {openAccordion === 'calculators' ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openAccordion === 'calculators'} timeout="auto">
            <List disablePadding sx={{ maxHeight: 160, overflow: 'auto' }}>
              {/* FD Calculator at the top for prominence */}
              <ListItem key="fd-calculator" disablePadding={true} dense={true}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link to={`/fixed-deposit/calculator`} className="menu-link">
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="FD Calculator" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem
                key="loan-rate-change-calculator"
                disablePadding={true}
                dense={true}
              >
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/loan-rate-change-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Loan Rate Change" />
                  </Link>
                </ListItemButton>
              </ListItem>
              {/* Popular and logical order */}
              <ListItem key="emi-calculator" disablePadding={true} dense={true}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/emi-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="EMI Calculator" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem key="sip-calculator" disablePadding={true} dense={true}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/sip-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="SIP Calculator" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem
                key="goal-calculator"
                disablePadding={true}
                dense={true}
              >
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/goal-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Goal Calculator" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem
                key="interest-calculator"
                disablePadding={true}
                dense={true}
              >
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/interest-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Interest Calculator" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem key="ppf-calculator" disablePadding={true} dense={true}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/ppf-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="PPF Calculator" />
                  </Link>
                </ListItemButton>
              </ListItem>
              {/* FD calculators moved here for logical grouping */}
              <ListItem key="stp-calculator" disablePadding={true} dense={true}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/stp-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="STP Calculator" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem key="swp-calculator" disablePadding={true} dense={true}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/swp-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="SWP Calculator" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem
                key="loan-prepay-vs-investment-calculator"
                disablePadding={true}
                dense={true}
              >
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/loan-prepay-vs-investment-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Loan Prepay vs Invest" />
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
          dense={true}
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
          >
            <AccountBalanceIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText primary="Government Schemes" />
            {openAccordion === 'government-schemes' ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItemButton>
          <Collapse in={openAccordion === 'government-schemes'} timeout="auto">
            <List disablePadding>
              <ListItem
                key="gov-schemes-comparison"
                disablePadding={true}
                dense={true}
              >
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/government-schemes/comparison`}
                    className="menu-link"
                  >
                    <AccountBalanceIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Schemes Comparison" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem key="fd-calculator" disablePadding={true} dense={true}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link to={`/fixed-deposit/calculator`} className="menu-link">
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="FD Calculator" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem key="ppf-calculator" disablePadding={true} dense={true}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }}>
                  <Link
                    to={`/calculators/ppf-calculator`}
                    className="menu-link"
                  >
                    <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="PPF Calculator" />
                  </Link>
                </ListItemButton>
              </ListItem>
              {/* Add more related calculators here if needed */}
            </List>
          </Collapse>
        </ListItem>
        <ListItem
          key="disclaimer"
          disablePadding
          dense={true}
          sx={{ display: 'block' }}
        >
          <ListItemButton onClick={onToggle}>
            <Link to={`/disclaimer`} className="menu-link">
              <DescriptionOutlined fontSize="small" sx={{ mr: 1 }} />
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
              <DescriptionOutlined fontSize="small" sx={{ mr: 1 }} />
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
              <MailOutline fontSize="small" sx={{ mr: 1 }} />
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
              <DescriptionOutlined fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary="About Us" />
            </Link>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Drawer open={isOpen} onClose={onToggle} variant="persistent">
        {DrawerList}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            p: 1,
            borderTop: '1px solid #ddd'
          }}
        >
          <SocialMediaLinks />
        </Box>
      </Drawer>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
        open={isOpen}
        onClick={onToggle}
      />
    </>
  );
}
