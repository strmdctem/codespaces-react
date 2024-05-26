import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export default function Navigation({ isOpen, onToggle }) {

    const DrawerList = (
        <Box sx={{ width: 250 }}>
            <List>
                {['Fixed Deposit', 'Home Loan'].map((text, index) => (
                    <ListItem key={text}>
                        <ListItemButton>
                            <ListItemText primary={text} />
                        </ListItemButton>
                        <Divider />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Drawer open={isOpen} onClose={onToggle}>
            {DrawerList}
        </Drawer>
    );
}
