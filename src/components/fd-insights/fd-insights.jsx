import { useTheme } from '@mui/material';
import Slider from 'react-slick';

export default function FDInsights() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  var settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true
  };
  return (
    <>
      {!isDark ? (
        <Slider {...settings}>
          <img src="insights/i1-private-1.svg"></img>
          <img src="insights/i1-private-2.svg"></img>
          <img src="insights/i1-private-3.svg"></img>
          <img src="insights/i2-private-1.svg"></img>
          <img src="insights/i2-private-2.svg"></img>
          <img src="insights/i2-private-3.svg"></img>
        </Slider>
      ) : (
        <Slider {...settings}>
          <img src="insights/black-i1-public-1.svg"></img>
          <img src="insights/black-i1-public-2.svg"></img>
          <img src="insights/black-i1-public-3.svg"></img>
          <img src="insights/black-i2-private-1.svg"></img>
          <img src="insights/black-i2-private-2.svg"></img>
          <img src="insights/black-i2-private-3.svg"></img>
        </Slider>
      )}
    </>
  );
}
