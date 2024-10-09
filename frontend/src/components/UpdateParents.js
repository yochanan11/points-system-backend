import React, { useState } from 'react';

function UpdateParents() {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`https://points-system-backend-6zon.vercel.app/api/students/${studentId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
      .then((response) => response.json())
      .then(() => {
        alert('הודעה נשלחה בהצלחה להורים');
        setMessage('');
      })
      .catch(() => alert('שגיאה בשליחת ההודעה להורים.'));
  };

  return (
    <div className="container mt-5">
      <h2>שלח עדכון להורים</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">מספר תעודת זהות של תלמיד</label>
          <input 
            type="text" 
            className="form-control" 
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">הודעה להורים</label>
          <textarea 
            className="form-control" 
            value={message}
            onChange={(e) => setMessage(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">שלח הודעה</button>
      </form>
    </div>
  );
}

export default UpdateParents;
