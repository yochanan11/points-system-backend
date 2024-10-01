import React, { useEffect, useState } from 'react';

function SearchResults({ searchId }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (searchId) {
      fetch(`/api/students/${searchId}`) // שינוי לנתיב יחסי
        .then((response) => response.json())
        .then((data) => {
          setStudent(data);
        })
        .catch((error) => {
          console.error('Error fetching student:', error);
        });
    }
  }, [searchId]);

  return (
    <div>
      {student ? (
        <div>
          <h3>{student.firstName} {student.lastName}</h3>
          <p>סניף: {student.branch}</p>
          <p>נקודות: {student.points}</p>
          <p>בונוס: {student.bonus}</p>
        </div>
      ) : (
        <p>לא נמצאו תוצאות עבור תעודת זהות {searchId}</p>
      )}
    </div>
  );
}

export default SearchResults;
