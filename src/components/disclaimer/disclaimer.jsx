import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import usePageInfo from '../page-info/use-page-info';

export default function Disclaimer() {
  usePageInfo({ title: 'Disclaimer' });
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Disclaimer
      </Typography>
      <Typography variant="subtitle2">
        Disclaimer of Liability and Financial Advice
      </Typography>
      <Typography variant="caption">
        The information provided in this app and on our website, including Fixed
        Deposit (FD) interest rates, Home Loan rates, and financial calculators,
        is for informational purposes only. It should not be considered
        financial advice. We strongly recommend consulting a qualified financial
        advisor before making any investment or loan decisions based on the
        information presented here.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Data Collection and Accuracy
      </Typography>
      <Typography variant="caption">
        The data in this app and on our website is sourced from publicly
        available information, including data from banks and financial
        institutions. While we strive for accuracy, we do not guarantee the
        completeness or timeliness of the data. Interest rates and other
        financial information are subject to change without notice.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Limitations of Financial Calculators
      </Typography>
      <Typography variant="caption">
        The financial calculators provided in this app and on our website are
        for estimation purposes only and should not be considered financial
        advice. The accuracy of the results depends on the accuracy of the
        information entered by the user. We recommend consulting a qualified
        financial advisor for personalized advice.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Intellectual Property
      </Typography>
      <Typography variant="caption">
        All content in this app and on our website, including text, graphics,
        data, and images, is the property of FinRates or its content suppliers
        and is protected by intellectual property laws. Unauthorized use or
        reproduction of any content is strictly prohibited.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Logos and Trademarks
      </Typography>
      <Typography variant="caption">
        The logos and trademarks displayed in this app and on our website are
        the property of their respective owners. The use of these logos and
        trademarks is for informational purposes only. The inclusion of these
        logos and trademarks does not imply endorsement or affiliation with the
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
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Disclaimer on Local Data Storage (Comparison History, Calculators &
        Portfolios)
      </Typography>
      <Typography variant="caption">
        To enhance your experience on FinRates, we utilize device storage to
        temporarily save: Comparison history across interest rates, financial
        products, and banks/NBFCs. Inputs in financial calculators (e.g., loan
        amount, tenure, rate) for a smoother experience during repeated visits.
        Saved portfolios or selections, allowing you to revisit and continue
        comparing without re-entering data.
        <br />
        Important notes: <br />
        This data is stored only on your browser`s local storage and is not
        transmitted to our servers. It is non-personal, anonymous, and used
        solely to provide a seamless and personalized experience. You can clear
        this data at any time through your device settings or app settings.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Use of Google Analytics
      </Typography>
      <Typography variant="caption">
        We use Google Analytics to track and analyze usage patterns. This helps
        us improve the user experience and optimize our services. Google
        Analytics collects anonymized data, such as device type, browser type,
        and pages visited. This data does not identify you personally. For more
        information on how Google Analytics collects and processes data, please
        visit Google&apos;s Privacy Policy.
      </Typography>

      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        App Updates and Functionality
      </Typography>
      <Typography variant="caption">
        The FinRates app may be updated from time to time to improve
        functionality, fix bugs, or comply with changes in operating systems or
        regulations. These updates may change how features work or add new
        capabilities. We recommend keeping the app updated to the latest version
        for the best experience.
      </Typography>

      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        App Store Compliance
      </Typography>
      <Typography variant="caption">
        The FinRates app is designed to comply with Google Play Store policies
        and guidelines. However, FinRates is not affiliated with, endorsed by,
        or in any way officially connected with Google LLC or any of its
        subsidiaries or affiliates.
      </Typography>
    </Box>
  );
}
