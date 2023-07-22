import PropTypes from 'prop-types';
import { BsSearch } from 'react-icons/bs';
import Notiflix from 'notiflix';
import { Header, Form, Input } from './Searchbar.styled';
import { Btn } from '../Button/Button';
import { useState } from 'react';

export const Searchbar = ({onSubmit}) => {
  const [query, setQuery] = useState('');

  const onInputChange = event => {
    setQuery(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (query.trim() === '') {
      return Notiflix.Notify.warning(
        'Please enter key words for search.'
      );
    }
    onSubmit(query);
    setQuery('');
  };

    return (
      <Header>
        <Form onSubmit={handleSubmit}>
          <Btn type="submit" icon={BsSearch} status="search" />
          <Input
            value={query}
            name="query"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={onInputChange}
          />
        </Form>
      </Header>
    );
  };


Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
