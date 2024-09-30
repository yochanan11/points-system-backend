import React, { useState, useEffect } from 'react';
import AddPoints from './AddPoints'; // נייבא את טופס עדכון הנקודות

export default function SearchResults({ searchId }) {
  const [student, setStudent] = useState(null);

  const fetchStudentData = () => {
    if (searchId) {
      fetch(`http://localhost:5000/api/students/${searchId}`)
        .then((response) => response.json())
        .then((data) => {
          setStudent(data || null);
        })
        .catch((error) => console.error('Error fetching student:', error));
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [searchId]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-3xl font-bold mb-8">תוצאות חיפוש</h2>
      {student ? (
        <div className="card max-w-md mx-auto shadow-lg rounded-lg d-flex flex-row p-4 align-items-center justify-content-center">
          <img
            src="/e.png"
            className="w-20 h-20 rounded-full mr-4 object-cover"
            alt="תמונת תלמיד"
          />
          <div>
            <h3 className="text-xl font-semibold mb-2">{student.firstName} {student.lastName}</h3>
            <p><strong>קוד זיהוי:</strong> {student.studentId}</p>
            <p><strong>סניף:</strong> {student.branch}</p>
            <p><strong>נקודות:</strong> {student.points}</p>
            <p><strong>בונוס:</strong> {student.bonus}</p>
            <p><strong>סה"כ נקודות:</strong> {student.points + student.bonus}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">לא נמצאו תוצאות</p>
      )}

      {student && (
        <div className="mt-4 d-flex justify-content-center">
          <AddPoints studentId={student.studentId} onUpdate={fetchStudentData} />
        </div>
      )}
    </div>
  );
}
