import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Gift, RotateCcw } from 'lucide-react';

export default function AddPoints({ studentId, onUpdate }) {
  const [points, setPoints] = useState('');
  const [showBonusModal, setShowBonusModal] = useState(false);

  const handleUpdatePoints = (isAddition) => {
    const pointsToAdd = isAddition ? parseInt(points) : -parseInt(points);

    fetch(`https://points-system-backend-6zon.vercel.app/api/students/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.totalPoints + pointsToAdd < 0) {
          alert("תלמי יקר אין לך מספיק נקודות");
          setPoints('');
        } else {
          fetch('https://points-system-backend-6zon.vercel.app/api/students/update-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId: studentId,
              points: pointsToAdd,
            }),
          })
            .then(() => {
              setPoints('');
              onUpdate();
            })
            .catch((error) => {
              alert('שגיאה בעדכון נקודות.');
            });
        }
      });
  };

  const handleResetPoints = () => {
    fetch('https://points-system-backend-6zon.vercel.app/api/students/reset-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: studentId,
      }),
    })
      .then(() => {
        onUpdate();
      })
      .catch((error) => {
        alert('שגיאה באיפוס הנקודות.');
      });
  };

  const handleBonusSubmit = (e) => {
    e.preventDefault();
    fetch('https://points-system-backend-6zon.vercel.app/api/students/update-bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: studentId,
        bonus: parseInt(points),
      }),
    })
      .then(() => {
        setPoints('');
        setShowBonusModal(false);
        onUpdate();
      })
      .catch((error) => {
        alert('שגיאה בהוספת בונוס.');
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-4 gap-3 flex-wrap">
      <input
        type="number"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
        placeholder="הכנס נק'"
        className="form-control text-center"
        style={{ width: '120px', height: '50px', fontSize: '1.2rem' }}
      />
      <button onClick={() => handleUpdatePoints(true)} className="btn btn-success d-flex align-items-center justify-content-center" style={{ width: '180px', height: '50px', fontSize: '1.2rem', color: 'white' }}>
        <PlusCircle className="me-2 h-5 w-5 text-white" /> הוסף נקודות
      </button>
      <button onClick={() => handleUpdatePoints(false)} className="btn btn-danger d-flex align-items-center justify-content-center" style={{ width: '180px', height: '50px', fontSize: '1.2rem', color: 'white' }}>
        <MinusCircle className="me-2 h-5 w-5 text-white" /> הסר נקודות
      </button>
      <button onClick={() => setShowBonusModal(true)} className="btn" style={{ backgroundColor: '#8e44ad', color: 'white', width: '180px', height: '50px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Gift className="me-2 h-5 w-5 text-white" /> הוסף בונוס
      </button>
      <button onClick={handleResetPoints} className="btn btn-warning d-flex align-items-center justify-content-center" style={{ width: '180px', height: '50px', fontSize: '1.2rem', color: 'white' }}>
        <RotateCcw className="me-2 h-5 w-5 text-white" /> איפוס נקודות
      </button>

      {showBonusModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">הוסף בונוס</h5>
                <button type="button" className="btn-close" onClick={() => setShowBonusModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleBonusSubmit}>
                  <label htmlFor="bonus">מספר הבונוס להוספה</label>
                  <input
                    id="bonus"
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    required
                    className="form-control"
                  />
                  <button type="submit" className="btn btn-success w-100 mt-3">הוסף בונוס</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
