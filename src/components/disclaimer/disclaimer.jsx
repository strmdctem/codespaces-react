import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import usePageInfo from '../page-info/use-page-info';

export default function Disclaimer() {
  usePageInfo({});
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2">
        Disclaimer of Liability and Financial Advice
      </Typography>
      <Typography variant="caption">
        The information provided on this website, including Fixed Deposit (FD)
        interest rates, Home Loan rates, and financial calculators, is for
        informational purposes only. It should not be considered financial
        advice. We strongly recommend consulting a qualified financial advisor
        before making any investment or loan decisions based on the information
        presented here.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Data Collection and Accuracy
      </Typography>
      <Typography variant="caption">
        The data on this website is sourced from publicly available information,
        including data from banks and financial institutions. While we strive
        for accuracy, we do not guarantee the completeness or timeliness of the
        data. Interest rates and other financial information are subject to
        change without notice.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Limitations of Financial Calculators
      </Typography>
      <Typography variant="caption">
        The financial calculators provided on this website are for estimation
        purposes only and should not be considered financial advice. The
        accuracy of the results depends on the accuracy of the information
        entered by the user. We recommend consulting a qualified financial
        advisor for personalized advice.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Intellectual Property
      </Typography>
      <Typography variant="caption">
        All content on this website, including text, graphics, data, and images,
        is the property of FinRates or its content suppliers and is protected by
        intellectual property laws. Unauthorized use or reproduction of any
        content is strictly prohibited.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Logos and Trademarks
      </Typography>
      <Typography variant="caption">
        The logos and trademarks displayed on this website are the property of
        their respective owners. The use of these logos and trademarks on this
        website is for informational purposes only. The inclusion of these logos
        and trademarks does not imply endorsement or affiliation with the
        respective institutions unless explicitly stated.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Changes to the Disclaimer
      </Typography>
      <Typography variant="caption">
        FinRates reserves the right to update this disclaimer at any time. Users
        are encouraged to review this disclaimer periodically to stay informed
        about any changes.
      </Typography>
    </Box>
  );
}
