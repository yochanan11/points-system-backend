import React from 'react';

function Menu({ setPage }) {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">תפריט ראשי</h2>
      <div className="d-grid gap-2 col-6 mx-auto">
        {/* כפתור הצגת כל התלמידים */}
        <button className="btn btn-primary" onClick={() => setPage('list')}>
          הצג את כל התלמידים
        </button>

        {/* כפתור חיפוש תלמיד לפי תעודת זהות */}
        <button className="btn btn-secondary" onClick={() => setPage('search')}>
          חפש תלמיד לפי תעודת זהות
        </button>

        {/* כפתור הוספת נקודות לתלמיד */}
        <button className="btn btn-success" onClick={() => setPage('addPoints')}>
          הוסף נקודות לתלמיד
        </button>

        {/* כפתור כתיבת עדכון להורים */}
        <button className="btn btn-warning" onClick={() => setPage('updateParents')}>
          כתוב עדכון להורים
        </button>
      </div>
    </div>
  );
}

export default Menu;
