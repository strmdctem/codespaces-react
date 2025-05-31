import { Box, Container, Paper } from '@mui/material';
import MuiMarkdown from 'mui-markdown';
import { useEffect, useState } from 'react';

const PPF = () => {
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    // Fetch the Markdown file from the public folder
    fetch('/ppf.md')
      .then((response) => response.text())
      .then((text) => setMarkdownContent(text))
      .catch((error) => console.error('Error loading PPF content:', error));
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 0 }}>
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Box
          sx={{
            px: 2,
            py: 0.5,
            '& h1': {
              fontSize: '1.30rem', // Smaller than default h1
              fontWeight: 'bold',
              marginBottom: '1rem',
              marginTop: '1.5rem'
            },
            '& h2': {
              fontSize: '1.15rem', // Smaller than default h2
              fontWeight: 'bold',
              marginBottom: '0.75rem',
              marginTop: '1.25rem'
            },
            '& h3': {
              fontSize: '1rem', // Smaller than default h2
              fontWeight: 'bold',
              marginBottom: '0.75rem',
              marginTop: '1.25rem'
            },
            '& img': {
              width: '100%'
            }
          }}
        >
          <MuiMarkdown>{markdownContent}</MuiMarkdown>
        </Box>
      </Paper>
    </Container>
  );
};

export default PPF;
