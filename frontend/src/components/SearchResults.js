import React, { useState, useEffect, useCallback } from 'react';
import AddPoints from './AddPoints';

export default function SearchResults({ searchId }) {
  const [student, setStudent] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const fetchStudentData = useCallback(() => {
    if (searchId) {
      fetch(`https://points-system-backend-6zon.vercel.app/api/students/${searchId}`)
        .then((response) => {
          if (!response.ok) {
            setNotFound(true);
            setStudent(null);
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            setStudent(data);
            setNotFound(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching student:', error);
          setNotFound(true);
        });
    }
  }, [searchId]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-3xl font-bold mb-8">תוצאות חיפוש</h2>
      {notFound ? (
        <p className="text-center text-gray-600">לא נמצאו תוצאות עבור תעודת הזהות שהוזנה</p>
      ) : (
        student ? (
          <div className="card max-w-md mx-auto shadow-lg rounded-lg d-flex flex-row p-4 align-items-center justify-content-center">
            <img
              src="/e.png"
              className="w-full max-w-xs h-auto object-contain"
              alt="תמונת תלמיד"
              style={{ maxHeight: '300px' }}
            />
            <div>
              <h3 className="text-xl font-semibold mb-2">{student.firstName} {student.lastName}</h3>
              <p><strong>קוד זיהוי:</strong> {student.studentId}</p>
              <p><strong>סניף:</strong> {student.branch}</p>
              <p><strong>נקודות:</strong> {student.totalPoints}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">טוען נתונים...</p>
        )
      )}

      {/* הצגת כפתורי הנקודות רק אם יש תוצאה */}
      {student && (
        <div className="mt-4 d-flex justify-content-center">
          <AddPoints studentId={student.studentId} onUpdate={fetchStudentData} />
        </div>
      )}
    </div>
  );
}
