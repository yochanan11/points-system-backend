import React, { useState } from 'react';

function Navbar({ setPage, setSearchId }) {
  const [searchId, setLocalSearchId] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId) {
      setSearchId(searchId);
      setPage('searchResults');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <button className="navbar-brand btn" onClick={() => setPage('menu')}>בנק מקראות</button>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="nav-link btn" onClick={() => setPage('list')}>הצג את כל התלמידים</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn" onClick={() => setPage('addPoints')}>הוסף נקודות לתלמיד</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn" onClick={() => setPage('updateParents')}>כתוב עדכון להורים</button>
            </li>
          </ul>
          <form className="d-flex ms-3" onSubmit={handleSearch}>
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="חפש לפי תעודת זהות" 
              aria-label="Search" 
              value={searchId}
              onChange={(e) => setLocalSearchId(e.target.value)} 
            />
            <button className="btn btn-outline-light" type="submit">חפש</button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
