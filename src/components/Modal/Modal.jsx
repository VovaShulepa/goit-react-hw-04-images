import { useEffect } from 'react';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

export const Modal = ({ handleImgClick, largeImgUrl }) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        handleImgClick('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleImgClick]);

  const handleBackdrop = event => {
    if (event.target === event.currentTarget) {
      handleImgClick('');
    }
  };

  return (
    <div className={css.Overlay} onClick={handleBackdrop}>
      <div className={css.Modal}>
        <img src={largeImgUrl} alt="Large" />
      </div>
    </div>
  );
};

Modal.propTypes = {
  handleImgClick: PropTypes.func.isRequired,
  largeImageURL: PropTypes.string.isRequired,
};
