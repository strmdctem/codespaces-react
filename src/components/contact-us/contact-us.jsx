import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import usePageInfo from '../page-info/use-page-info';

export default function ContactUs() {
  usePageInfo({
    title: 'Contact Us'
  });

  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleSubmit = () => {
    setLoading(true);
  };

  return (
    <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Contact us
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          We value your inputs! Please fill out the form below.
        </Typography>
        <br />
        <form
          action="https://formsubmit.co/finratesindia@gmail.com"
          method="POST"
          onSubmit={handleSubmit}
        >
          <Box sx={{ mb: 2 }}>
            <label
              htmlFor="feedback-textarea"
              style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}
            >
              Feedback / Suggestion <span style={{ color: '#d32f2f' }}>*</span>
            </label>
            <textarea
              autoFocus
              id="feedback-textarea"
              name="message"
              required
              rows={10}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
                fontSize: 16,
                resize: 'none',
                fontFamily: 'inherit',
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = theme.palette.primary.main)
              }
              onBlur={(e) =>
                (e.target.style.borderColor = theme.palette.divider)
              }
            />
          </Box>
          <TextField
            label="Name (optional)"
            name="name"
            fullWidth
            margin="normal"
            autoComplete="name"
            style={{ border: `1px solid ${theme.palette.divider}` }}
          />
          <TextField
            label="Email (optional)"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            autoComplete="email"
          />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value={window.location.href} />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            Send
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
