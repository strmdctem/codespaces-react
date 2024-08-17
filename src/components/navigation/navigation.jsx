import { ExpandLess, ExpandMore } from '@mui/icons-material';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
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
          dense={false}
          sx={{ display: 'block' }}
        >
          <ListItemButton onClick={handleClick} selected={open}>
            <SavingsOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText primary="Fixed Deposit" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto">
            <List disablePadding>
              <ListItem key="fixed-deposit" disablePadding={true} dense={false}>
                <ListItemButton onClick={onToggle} sx={{ pl: 4 }} dense={false}>
                  <Link to={`/fixed-deposit`} className="menu-link">
                    <TableChartOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Screener - All Rates" />
                  </Link>
                </ListItemButton>
              </ListItem>
              <ListItem
                key="calculate-and-compare"
                disablePadding={true}
                dense={false}
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
                <List disablePadding sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {bankMap.map((bank) => (
                    <ListItem
                      className="bank-list-item"
                      key={bank.key}
                      disablePadding
                      dense={true}
                    >
                      <ListItemButton onClick={onToggle}>
                        <Link to={`/fixed-deposit/${bank.key}`}>
                          <svg className="logo">
                            <use xlinkHref={`sprite.css.svg#${bank.key}`}></use>
                          </svg>
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
          key="contact-us"
          disablePadding
          dense={false}
          sx={{ display: 'block' }}
        >
          <ListItemButton onClick={onToggle}>
            <Link to={`/contact-us`} className="menu-link">
              <MailOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
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
      </Drawer>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
        open={isOpen}
        onClick={onToggle}
      />
    </>
  );
}
