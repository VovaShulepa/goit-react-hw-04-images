import React from 'react';
import { useState, useEffect } from 'react';
import { getImages, normalizeImages } from './service/image-service';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [largeImgUrl, setLargeImgUrl] = useState('');
  const [emptyRequest, setEmptyRequest] = useState(false);
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    if (!query) return;

    const fetchImages = async () => {
      setIsLoading(true);
      setError('');

      try {
        const { hits, totalHits } = await getImages(query, page);

        const normalizedImages = normalizeImages(hits);

        if (normalizedImages.length === 0) {
          setEmptyRequest(true);
          return;
        }
        setImages(prev => [...prev, ...normalizedImages]);
        setTotalImages(totalHits);
      } catch (error) {
        setError('Server not answering');
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, [query, page]);

  const getQuery = queryText => {
    if (queryText === query) {
      alert('You enter the same query, please try something else 🙌');
      return;
    }
    setQuery(queryText);
    setImages([]);
    setPage(1);
    setEmptyRequest(false);
  };

  const handleImgClick = largeImgUrl => {
    setLargeImgUrl(largeImgUrl);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    console.log('load');
  };

  const showGallery = images.length > 0;
  const showError = error.length > 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: '16px',
        paddingBottom: '24px',
      }}
    >
      <div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
      <Searchbar onSubmit={getQuery} />
      {showError && (
        <p>
          Ooops, something went wrong...<b>{error}</b>
        </p>
      )}
      {emptyRequest && (
        <p>
          Please enter your request <b>{query}</b> correctly and try one more
          time 🙏
        </p>
      )}
      {isLoading && <Loader />}
      {showGallery && (
        <ImageGallery onImageClick={handleImgClick} images={images} />
      )}
      {images.length > 0 && totalImages > page && !isLoading && (
        <Button onClick={handleLoadMore} />
      )}
      {largeImgUrl && (
        <Modal largeImgUrl={largeImgUrl} handleImgClick={handleImgClick} />
      )}
    </div>
  );
};
