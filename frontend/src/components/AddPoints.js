import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Gift, RotateCcw } from 'lucide-react';

export default function AddPoints({ studentId, onUpdate }) {
  const [points, setPoints] = useState('');
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleUpdatePoints = (isAddition) => {
    const pointsToAdd = isAddition ? parseInt(points) : -parseInt(points);

    fetch(`https://points-system-backend-6zon.vercel.app/api/students/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.totalPoints + pointsToAdd < 0) {
          showAlert("תלמיד יקר אין לך מספיק נקודות", 'danger');
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
              showAlert('הנקודות עודכנו בהצלחה', 'success');
            })
            .catch((error) => {
              showAlert('שגיאה בעדכון נקודות', 'danger');
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
        showAlert('הנקודות אופסו בהצלחה', 'warning');
      })
      .catch((error) => {
        showAlert('שגיאה באיפוס הנקודות', 'danger');
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
        showAlert('הבונוס נוסף בהצלחה', 'info');
      })
      .catch((error) => {
        showAlert('שגיאה בהוספת בונוס', 'danger');
      });
  };

  return (
    <div className="d-flex flex-column align-items-center mt-4 gap-3">
      {alert.show && (
        <div className={`alert alert-${alert.type} w-100 text-center`} role="alert">
          {alert.message}
        </div>
      )}

      <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="הכנס נקודות"
          className="form-control text-center"
          style={{ width: '150px', height: '50px', fontSize: '1.2rem' }}
        />
        <button
          onClick={() => handleUpdatePoints(true)}
          className="btn btn-success d-flex align-items-center justify-content-center"
          style={{ width: '160px', height: '50px', fontSize: '1rem', color: 'white' }}
        >
          <PlusCircle style={{ marginRight: '8px' }} className="text-white" /> הוסף נקודות
        </button>
        <button
          onClick={() => handleUpdatePoints(false)}
          className="btn btn-danger d-flex align-items-center justify-content-center"
          style={{ width: '160px', height: '50px', fontSize: '1rem', color: 'white' }}
        >
          <MinusCircle style={{ marginRight: '8px' }} className="text-white" /> הסר נקודות
        </button>
        <button
          onClick={() => setShowBonusModal(true)}
          className="btn"
          style={{
            backgroundColor: '#8e44ad',
            color: 'white',
            width: '160px',
            height: '50px',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Gift style={{ marginRight: '8px' }} className="text-white" /> הוסף בונוס
        </button>
        <button
          onClick={handleResetPoints}
          className="btn btn-warning d-flex align-items-center justify-content-center"
          style={{ width: '160px', height: '50px', fontSize: '1rem', color: 'white' }}
        >
          <RotateCcw style={{ marginRight: '8px' }} className="text-white" /> איפוס נקודות
        </button>
      </div>

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
