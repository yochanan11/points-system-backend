import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Gift } from 'lucide-react';

export default function AddPoints({ studentId, onUpdate }) {
  const [points, setPoints] = useState('');
  const [bonus, setBonus] = useState('');
  const [showBonusModal, setShowBonusModal] = useState(false);

  const handleUpdatePoints = (isAddition) => {
    fetch('http://localhost:5000/api/students/update-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: studentId,
        points: isAddition ? parseInt(points) : -parseInt(points),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(isAddition ? 'נקודות נוספו בהצלחה!' : 'נקודות הוסרו בהצלחה!');
        setPoints('');
        onUpdate();
      })
      .catch((error) => {
        alert('שגיאה בעדכון נקודות.');
      });
  };

  const handleBonusSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/students/update-bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: studentId,
        bonus: parseInt(bonus),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('בונוס נוסף בהצלחה!');
        setBonus('');
        setShowBonusModal(false);
        onUpdate();
      })
      .catch((error) => {
        alert('שגיאה בהוספת בונוס.');
      });
  };

  return (
    <div className="flex flex-col items-center mt-4"> {/* תכונה לסידור הכפתורים ושדה הקלט */}
      <div className="flex items-center space-x-4 rtl:space-x-reverse w-full justify-center mb-4"> {/* תוספת רווחים בין הכפתורים */}
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="הכנס נק'"
          className="form-control w-24 h-10 text-center text-sm p-2 border border-gray-300 rounded"
        />
        <button onClick={() => handleUpdatePoints(true)} className="btn btn-success px-4">
          <PlusCircle className="mr-1 h-4 w-4" /> הוסף נקודות
        </button>
        <button onClick={() => handleUpdatePoints(false)} className="btn btn-danger px-4">
          <MinusCircle className="mr-1 h-4 w-4" /> הסר נקודות
        </button>
        <button onClick={() => setShowBonusModal(true)} className="btn btn-secondary px-4">
          <Gift className="mr-1 h-4 w-4" /> הוסף בונוס
        </button>
      </div>

      {/* מודאל הוספת בונוס */}
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
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
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
