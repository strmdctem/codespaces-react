import { useEffect } from 'react';

const DEFAULT_TITLE =
  'FinRates - Latest Fixed Deposit Interest Rates in India 2024';
const DEFAULT_DESCRIPTION =
  'Check the Latest FD Rates from Top Banks and NBFCs in India 2024. Use FinRates FD Screener and Calculator to Compare Rates and Calculate Returns easily.';

const usePageInfo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION
}) => {
  useEffect(() => {
    document.title = `FinRates - ${title}`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);
};

export default usePageInfo;
