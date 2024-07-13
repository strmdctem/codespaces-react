import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

export default function Disclaimer() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2">
        Disclaimer of liability and finance
      </Typography>
      <Typography variant="caption">
        The information provided on this website, including Fixed Deposit (FD)
        interest rates, Home Loan rates, and any financial calculators, is
        intended for informational purposes only and should not be construed as
        financial advice. We strongly recommend consulting with a qualified
        financial advisor before making any investment or loan decisions based
        on the information presented here.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Data Collection and Sources
      </Typography>
      <Typography variant="caption">
        The data presented on this website is collected from publicly available
        sources, including information provided by banks and financial
        institutions. However, we do not guarantee the accuracy, completeness,
        or timeliness of the data. Users should be aware that interest rates and
        other financial information are subject to change without notice.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Indicative Rates and Estimates
      </Typography>
      <Typography variant="caption">
        The home loan interest rates and other financial data displayed on this
        website are indicative and may vary depending on individual credit
        history, loan amount, property type, location, and other factors. We
        cannot guarantee that users will qualify for any specific rate or
        product.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Risk Disclosure
      </Typography>
      <Typography variant="caption">
        All investments carry inherent risks, and FD rates are not guaranteed.
        The displayed interest rates do not guarantee approval for a home loan
        or any other financial product. Loan approval is subject to the final
        decision of the chosen bank or financial institution.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Limitation of Calculators
      </Typography>
      <Typography variant="caption">
        Any financial calculators provided on this website are for estimation
        purposes only and should not be considered as financial advice. The
        accuracy of the results depends on the accuracy of the information
        entered by the user. Users should consult with a qualified financial
        advisor for personalized advice based on their individual financial
        circumstances
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Affiliated Content
      </Typography>
      <Typography variant="caption">
        This website may contain affiliate links and sponsored content. We may
        receive a commission for purchases or actions made through these links.
        However, the presence of affiliate links and advertising does not
        constitute an endorsement of the products or services offered.
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Intellectual Property
      </Typography>
      <Typography variant="caption">
        All content on this website, including text, graphics, logos, and
        images, is the property of [Your Website Name] or its content suppliers
        and is protected by intellectual property laws. Unauthorized use or
        reproduction of any content is strictly prohibited
      </Typography>
      <Typography variant="subtitle2" sx={{ marginTop: 3 }}>
        Logos and Icons
      </Typography>
      <Typography variant="caption">
        The logos and trademarks displayed on this website are the property of
        their respective owners. The use of these logos and trademarks on this
        website is for informational purposes only. The inclusion of these logos
        and trademarks does not imply endorsement or affiliation with the
        respective institutions unless explicitly stated.
      </Typography>
    </Box>
  );
}
