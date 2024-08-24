import { useEffect } from 'react';

const DEFAULT_TITLE =
  'FinRates - Latest Fixed Deposit Interest Rates in India 2024';
const DEFAULT_DESCRIPTION =
  'Check and Compare the latest FD rates from all leading banks and NBFCs in India 2024. Compare Fixed deposit rates and Calculate returns on your savings to make informed decisions easily.';

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
