import React, { useEffect, useState } from 'react';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/students')
      .then(response => response.json())
      .then(data => {
        // סינון תלמידים עם כל השדות המלאים
        const validStudents = data.filter(student => 
          student.studentId && student.firstName && student.lastName && student.branch && student.points !== undefined && student.bonus !== undefined
        );
        setStudents(validStudents);
        setFilteredStudents(validStudents);

        // יצירת רשימה של סניפים ייחודיים מתוך הנתונים שהתקבלו
        const uniqueBranches = [...new Set(validStudents.map(student => student.branch))];
        setBranches(uniqueBranches);
      })
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  // פונקציה לסינון לפי סניף
  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);

    if (branch === '') {
      setFilteredStudents(students); // הצגת כל התלמידים אם לא נבחר סניף
    } else {
      const filtered = students.filter(student => student.branch === branch);
      setFilteredStudents(filtered);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">רשימת תלמידים</h2>

      {/* סינון לפי סניפים */}
      <div className="mb-4">
        <label htmlFor="branchFilter" className="form-label">סנן לפי סניף:</label>
        <select 
          id="branchFilter" 
          className="form-select" 
          value={selectedBranch} 
          onChange={handleBranchChange}
        >
          <option value="">הצג את כל הסניפים</option>
          {branches.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>קוד זיהוי</th>
              <th>שם פרטי</th>
              <th>שם משפחה</th>
              <th>סניף</th>
              <th>נקודות</th>
              <th>בונוס</th>
              <th>סה"כ</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.studentId}>
                <td>{student.studentId}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.branch}</td>
                <td>{student.points}</td>
                <td>{student.bonus}</td>
                <td>{student.points + student.bonus}</td> {/* חישוב סה"כ */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;
