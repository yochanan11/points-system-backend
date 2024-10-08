import React, { useEffect, useState } from 'react';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(true); // מצב טעינה

  useEffect(() => {
    fetch('http://localhost:5000/api/students')
      .then((response) => response.json())
      .then((data) => {
        const validStudents = data.filter((student) =>
          student.studentId && student.firstName && student.lastName && student.branch && student.totalPoints !== undefined
        );
        setStudents(validStudents);
        setFilteredStudents(validStudents);

        const uniqueBranches = [...new Set(validStudents.map((student) => student.branch))];
        setBranches(uniqueBranches);
        setLoading(false); // עצירת הטעינה
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setLoading(false); // עצירת הטעינה במקרה של שגיאה
      });
  }, []);

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);

    if (branch === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) => student.branch === branch);
      setFilteredStudents(filtered);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">רשימת תלמידים</h2>

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

      {loading ? (
        <p>טוען נתונים...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>קוד זיהוי</th>
                <th>שם פרטי</th>
                <th>שם משפחה</th>
                <th>סניף</th>
                <th>נקודות</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.branch}</td>
                    <td>{student.totalPoints}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">לא נמצאו תלמידים</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentList;
