import { Swiper } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export const CustomSlider = ({
  perView = 1,
  autoplay,
  children,
  breakpoints,
  className,
  spaceBetween = 0,
  bulletsColor = "#007aff",
}) => {
  const swiperRef = useRef(null);
  const { i18n } = useTranslation();
  
  useEffect(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      const updatePaginationColor = () => {
        const bullets = document.querySelectorAll(".swiper-pagination-bullet");
        bullets.forEach((bullet) => {
          bullet.style.backgroundColor = bulletsColor;
        });

        const activeBullet = document.querySelector(
          ".swiper-pagination-bullet-active"
        );
        if (activeBullet) {
          activeBullet.style.backgroundColor = bulletsColor;
        }
      };
      updatePaginationColor();
      swiperInstance.on("slideChange", updatePaginationColor);
    }
  }, [bulletsColor, i18n.language]);

  useEffect(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      if (autoplay) {
        swiperInstance.params.autoplay.delay = autoplay;
        swiperInstance.autoplay.start();
      } else {
        swiperInstance.autoplay.stop();
      }
    }
  }, [autoplay, i18n.language]);

  return (
    <Swiper
      key={i18n.language}
      ref={swiperRef}
      className={`w-full ${className}`}
      slidesPerView={perView}
      breakpoints={{ ...breakpoints }}
      modules={[Pagination, Navigation, Autoplay]}
      spaceBetween={spaceBetween}
      pagination={{ clickable: true }}
      autoplay={{
        delay: autoplay,
        disableOnInteraction: true,
      }}
    >
      {children}
    </Swiper>
  );
};

CustomSlider.propTypes = {
  perView: PropTypes.number,
  autoplay: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  children: PropTypes.node,
  breakpoints: PropTypes.object,
  className: PropTypes.string,
  spaceBetween: PropTypes.number,
  bulletsColor: PropTypes.string,
};
