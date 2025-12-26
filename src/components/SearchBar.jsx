import { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search resources, courses, or materials..." }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="search-bar-wrapper">
      <form className="search-bar" onSubmit={handleSubmit}>
        <div className="search-input-container">
          <ion-icon name="search-outline" className="search-icon"></ion-icon>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="search-button">
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
