import React, { useEffect, useState } from 'react';

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('/api/students') // שינוי לנתיב יחסי
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
      });
  }, []);

  return (
    <div>
      {/* כאן תוכל להציג את רשימת התלמידים */}
      {students.map((student) => (
        <div key={student.studentId}>
          <h3>{student.firstName} {student.lastName}</h3>
          <p>סניף: {student.branch}</p>
          <p>נקודות: {student.points}</p>
          <p>בונוס: {student.bonus}</p>
        </div>
      ))}
    </div>
  );
}

export default StudentList;
