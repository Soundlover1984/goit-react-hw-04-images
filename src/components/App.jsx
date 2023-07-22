import React from 'react';
import Notiflix from 'notiflix';
import { fetchData } from './imageApiService';
import { Container } from './App.styled';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Btn } from './Button/Button';
import { useState, useEffect } from 'react';

export const App = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [picsArr, setPicsArr] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
  const [imageTags, setImageTags] = useState(null);
  const [largeImageURL, setLargeImageURL] = useState('');


    useEffect(() => {
    if (!searchQuery) {
      return;
    }
    setIsLoading(true);
    fetchQuery(searchQuery, page);
  }, [searchQuery, page]);

    const onSubmit = query => {
    setSearchQuery(query);
    setPicsArr([]);
    setPage(1);
  };

    const toggleModal = (largeImageURL, imageTags) => {
    setShowModal(!showModal);
    setLargeImageURL(largeImageURL);
    setImageTags(imageTags);
  };

    const onLoadMoreBtnClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  async function fetchQuery(query, page) {
    try {
      await fetchData(query, page).then(result => {
        const data = result.data;
        const total = data.totalHits;
        const picsArr = data.hits;
        const picsLeft = total - 12 * page;

        if (picsArr.length === 0) {
          showLoadMoreBtn(false);
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        } else {
          setPicsArr(PrevPicsArr => [...PrevPicsArr, ...picsArr]);
        }

        if (picsArr.length > 0 && page === 1) {
          Notiflix.Notify.success(
            `Hooray! We found ${total} images.`
          );
        }
        picsLeft > 0 ? setShowLoadMoreBtn(true) : setShowLoadMoreBtn(false);
      });

    } catch (error) {
      console.log(error);
      Notiflix.Notify.failure(
        'Sorry, something went wrong, please try again later'
      );
    } finally {
      setIsLoading(false );
    }
  }

    return (
      <>
        <Searchbar onSubmit={onSubmit} />

        <Container>
          <ImageGallery
            pics={picsArr}
            showModal={toggleModal}
          />

          {showLoadMoreBtn && (
            <Btn
              text="Load more"
              status="load"
              onClick={onLoadMoreBtnClick}
            />
          )}
        </Container>
        {isLoading && <Loader />}

        {showModal && (
          <Modal
            src={largeImageURL}
            alt={imageTags}
            closeModal={toggleModal}
          />
        )}
      </>
    );
  };
