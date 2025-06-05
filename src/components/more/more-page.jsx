import {
  ContactPhone,
  Description,
  Info,
  Policy,
  Share
} from '@mui/icons-material';
import {
  Avatar,
  Card,
  CardContent,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { isCapacitorApp } from '../utils';
import SocialMediaLinks from '../social-media-links/social-media-links';

const MORE_MENU_ITEMS = [
  {
    title: 'About Us',
    description: 'Learn about our mission and team',
    icon: <Info />,
    link: '/about-us',
    color: '#1976d2'
  },
  {
    title: 'Contact Us',
    description: 'Get in touch with our support team',
    icon: <ContactPhone />,
    link: '/contact-us',
    color: '#2e7d32'
  },
  {
    title: 'Privacy Policy',
    description: 'How we protect your data',
    icon: <Policy />,
    link: '/privacy-policy',
    color: '#ed6c02'
  },
  {
    title: 'Disclaimer',
    description: 'Terms and conditions',
    icon: <Description />,
    link: '/disclaimer',
    color: '#9c27b0'
  }
];

export default function MorePage() {
  const theme = useTheme();
  const isAppMode = isCapacitorApp();

  const handleShare = async () => {
    const shareData = {
      title: 'FinRates - Financial Planning Made Easy',
      text: 'Compare FD rates, calculate returns, and make informed financial decisions',
      url: 'https://finrates.co.in'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(shareData.url);
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: isAppMode ? 2 : 4,
        px: isAppMode ? 1 : 2
      }}
    >
      {/* App Info Section */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600, color: 'primary.main' }}
          >
            FinRates
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, maxWidth: '300px', mx: 'auto' }}
          >
            Your comprehensive financial planning platform for comparing rates, 
            calculating returns, and making informed investment decisions.
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Version 1.0.0
          </Typography>
        </CardContent>
      </Card>

      {/* Navigation Menu */}
      <Card elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <List disablePadding>
          {MORE_MENU_ITEMS.map((item, index) => (
            <div key={item.link}>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.link}
                  sx={{
                    py: 2,
                    px: 2,
                    '&:hover': {
                      backgroundColor: alpha(item.color, 0.08)
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: alpha(item.color, 0.1),
                        color: item.color,
                        width: 40,
                        height: 40
                      }}
                    >
                      {item.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.title}
                    secondary={item.description}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.95rem'
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.8rem'
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {index < MORE_MENU_ITEMS.length - 1 && (
                <Divider sx={{ ml: 8 }} />
              )}
            </div>
          ))}
          
          {/* Share App Option */}
          <Divider sx={{ ml: 8 }} />
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleShare}
              sx={{
                py: 2,
                px: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.success.main, 0.08)
                }
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    width: 40,
                    height: 40
                  }}
                >
                  <Share />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Share App"
                secondary="Tell others about FinRates"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }}
                secondaryTypographyProps={{
                  fontSize: '0.8rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Card>

      {/* Social Media Links */}
      <Card
        elevation={0}
        sx={{
          mt: 3,
          textAlign: 'center',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 2 }}
          >
            Follow Us
          </Typography>
          <SocialMediaLinks />
        </CardContent>
      </Card>
    </Container>
  );
}
