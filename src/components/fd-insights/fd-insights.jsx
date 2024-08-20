import { useTheme } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export default function FDInsights() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  var settings = {
    lazyLoad: true,
    infinite: true,
    speed: 2000,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    dots: true,
    autoplay: true
  };

  return (
    <>
      {!isDark ? (
        <Slider {...settings}>
          <img
            src="insights/i1-public-1.svg"
            alt="insights"
            height="240"
            width="350"
            loading="lazy"
          ></img>
          <img
            src="insights/i1-public-2.svg"
            alt="insights"
            height="240"
            width="350"
            loading="lazy"
          ></img>
          <img
            src="insights/i1-public-3.svg"
            alt="insights"
            height="240"
            width="350"
            loading="lazy"
          ></img>
          <img
            src="insights/i2-private-1.svg"
            alt="insights"
            height="240"
            width="350"
            loading="lazy"
          ></img>
          <img
            src="insights/i2-private-2.svg"
            alt="insights"
            height="240"
            width="350"
            loading="lazy"
          ></img>
          <img
            src="insights/i2-private-3.svg"
            height="240"
            width="350"
            loading="lazy"
          ></img>
        </Slider>
      ) : (
        <Slider {...settings}>
          <img
            src="insights/black-i1-public-1.svg"
            alt="insights"
            height="240"
            width="350"
            loading="lazy"
          ></img>
          <img
            src="insights/black-i1-public-2.svg"
            alt="insights"
            height="240"
            width="350"
            loading="lazy"
          ></img>
          <img
            src="insights/black-i1-public-3.svg"
            alt="insights"
            height="240"
            width="350"
            loading="lazy"
          ></img>
          <img
            src="insights/black-i2-private-1.svg"
            alt="insights"
            height="240"
            width="350"
            loading="lazy"
          ></img>
          <img
            src="insights/black-i2-private-2.svg"
            alt="insights"
            height="240"
            width="350"
            loading="lazy"
          ></img>
          <img
            src="insights/black-i2-private-3.svg"
            alt="insights"
            height="240"
            width="350"
            loading="lazy"
          ></img>
        </Slider>
      )}
    </>
  );
}
