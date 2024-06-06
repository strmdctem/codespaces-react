import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FDBankTable from './table';
import { getBankRates } from '../fd-view/data';
import { useMemo } from 'react';
import { Link } from '@mui/material';

const FDBankView = ({ name, backClick }) => {

    const data = useMemo(() => {
        return getBankRates(name);
    });

    return (
        <>
            <Typography variant="subtitle1" sx={{ m: 2 }}>
                {name} &nbsp;&nbsp;
                <Link onClick={backClick}>
                    Back
                </Link>
            </Typography>
            <FDBankTable data={data} />
        </>
    );
};

export default FDBankView;
