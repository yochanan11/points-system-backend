import React from 'react';

function Menu({ setPage }) {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">תפריט ראשי</h2>
      <div className="d-grid gap-2 col-6 mx-auto">
        <button className="btn btn-primary" onClick={() => setPage('list')}>
          הצג את כל התלמידים
        </button>
       
        <button className="btn btn-info" onClick={() => setPage('addStudent')}>
          הוסף תלמיד חדש
        </button>

        <button className="btn btn-secondary" onClick={() => setPage('search')}>
          חפש תלמיד לפי תעודת זהות
        </button>
        <button className="btn btn-success" onClick={() => setPage('addPoints')}>
          הוסף נקודות לתלמיד
        </button>
        <button className="btn btn-warning" onClick={() => setPage('updateParents')}>
          כתוב עדכון להורים
        </button>
      </div>
    </div>
  );
}

export default Menu;
