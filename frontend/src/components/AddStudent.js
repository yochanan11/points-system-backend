import React, { useState } from 'react';
import CustomAlert from './CustomAlert';

function AddStudent({ onStudentAdded }) {
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [branch, setBranch] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [studentComments, setStudentComments] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  // רשימת סניפים - ניתן להוסיף ערכים בהמשך
  const branches = ['מודיעין עילית', 'ביתר', 'בית שמש'];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!studentId || !firstName || !lastName || !branch) {
      showAlert('כל השדות הם חובה.', 'danger');
      return;
    }

    // בדיקה אם התלמיד כבר קיים
    fetch(`https://points-system-backend-6zon.vercel.app/api/students/${studentId}`)
      .then((response) => {
        if (response.status === 404) {
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          showAlert('תלמיד עם מספר זהות זה כבר קיים במערכת.', 'danger');
        } else {
          const newStudent = {
            studentId: parseInt(studentId),
            firstName,
            lastName,
            branch,
            totalPoints: parseInt(totalPoints),
            studentComments,
          };

          fetch('https://points-system-backend-6zon.vercel.app/api/students', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStudent),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('שגיאה בהוספת תלמיד.');
              }
              return response.json();
            })
            .then(() => {
              showAlert('התלמיד נוסף בהצלחה!', 'success');
              if (typeof onStudentAdded === 'function') {
                onStudentAdded();
              }
              setStudentId('');
              setFirstName('');
              setLastName('');
              setBranch('');
              setTotalPoints(0);
              setStudentComments('');
            })
            .catch((error) => {
              showAlert(error.message, 'danger');
            });
        }
      })
      .catch(() => {
        showAlert('שגיאה בבדיקת קיום התלמיד.', 'danger');
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      {alert.show && (
        <div className="alert-wrapper" style={{ position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)', zIndex: 1050 }}>
          <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert({ show: false, message: '', type: '' })} />
        </div>
      )}
      <div className="card p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">הוסף תלמיד חדש</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">מספר תלמיד</label>
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