import React, { useState } from 'react';

function AddStudent({ onStudentAdded }) {
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [branch, setBranch] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [studentComments, setStudentComments] = useState('');

  // רשימת סניפים - ניתן להוסיף ערכים בהמשך
  const branches = ['מודיעין עילית', 'ביתר', 'בית שמש'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudent = {
      studentId: parseInt(studentId),
      firstName,
      lastName,
      branch,
      totalPoints: parseInt(totalPoints),
      studentComments,
    };

    fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('התלמיד נוסף בהצלחה!');
        onStudentAdded();
        setStudentId('');
        setFirstName('');
        setLastName('');
        setBranch('');
        setTotalPoints(0);
        setStudentComments('');
      })
      .catch((error) => {
        console.error('Error adding student:', error);
        alert('שגיאה בהוספת תלמיד.');
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="card p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">הוסף תלמיד חדש</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">מספר תעודת זהות</label>
            <input
              type="number"
              className="form-control"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">שם פרטי</label>
            <input
              type="text"
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">שם משפחה</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">סניף</label>
            <select
              className="form-select"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
            >
              <option value="">בחר סניף</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">נקודות</label>
            <input
              type="number"
              className="form-control"
              value={totalPoints}
              onChange={(e) => setTotalPoints(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">הערות על התלמיד</label>
            <textarea
              className="form-control"
              value={studentComments}
              onChange={(e) => setStudentComments(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">הוסף תלמיד</button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
