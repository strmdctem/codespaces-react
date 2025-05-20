import {
  DescriptionOutlined,
  ExpandLess,
  ExpandMore,
  MailOutline
} from '@mui/icons-material';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
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
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
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
          <ListItemButton onClick={handleClick} selected={open}>
            <SavingsOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText primary="Fixed Deposit" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto">
            <List disablePadding>
              <ListItem key="fixed-deposit" disablePadding={true} dense={true}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }} dense={true}>
                  <Link to={`/fixed-deposit`} className="menu-link">
                    <TableChartOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Screener - All Rates" />
                  </Link>
                </ListItemButton>
              </ListItem>
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
              <Divider sx={{ ml: 3 }} />
              <ListItem>
                <List disablePadding sx={{ maxHeight: 180, overflow: 'auto' }}>
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
        <ListItem
          key="calculators"
          disablePadding={true}
          dense={true}
          sx={{ display: 'block' }}
        >
          <ListItemButton onClick={handleClick} selected={open}>
            <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText primary="Calculators" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto">
            <List disablePadding>
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
              </ListItem>{' '}
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
              </ListItem>{' '}
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
            </List>
          </Collapse>
        </ListItem>
        <ListItem
          key="disclaimer"
          disablePadding
          dense={true}
          sx={{ display: 'block' }}
        >
          <ListItemButton>
            <Link to={`/disclaimer`} className="menu-link">
              <DescriptionOutlined fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary="Disclaimer" />
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
            p: 2,
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
