import Box from '@mui/material/Box';
import { useState } from 'react';
import Loading from '../loading/loading';

export default function ContactUs() {
  const [loading, setLoading] = useState(true);

  const handleIframeLoad = () => {
    setLoading(false);
  };
  return (
    <Box sx={{ height: '90vh' }}>
      {loading && <Loading />}
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSd8TkgzzKy-g12VkbDMjH6Rmhs7XQt_yxCdYRb9EdgtNlItdQ/viewform?embedded=true"
        width="100%"
        height="100%"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        onLoad={handleIframeLoad}
        title="Contact Us Form"
      >
        {<Loading />}
      </iframe>
    </Box>
  );
}
