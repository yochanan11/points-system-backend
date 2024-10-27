import React, { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import CustomAlert from './CustomAlert';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  // שליפת רשימת התלמידים והסניפים מהשרת
  useEffect(() => {
    fetch('https://points-system-backend-6zon.vercel.app/api/students')
      .then((response) => response.json())
      .then((data) => {
        const validStudents = data.filter((student) =>
          student.studentId && student.firstName && student.lastName && student.branchId && student.totalPoints !== undefined
        );
        setStudents(validStudents);
        setFilteredStudents(validStudents);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        showAlert('שגיאה בטעינת רשימת התלמידים.', 'danger');
        setLoading(false);
      });

    // שליפת רשימת הסניפים מהשרת
    fetch('https://points-system-backend-6zon.vercel.app/api/branches')
      .then((response) => response.json())
      .then((data) => setBranches(data))
      .catch((error) => {
        console.error('Error fetching branches:', error);
        showAlert('שגיאה בטעינת רשימת הסניפים.', 'danger');
      });
  }, []);

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);

    if (branch === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) => student.branchId?.branchName === branch);
      setFilteredStudents(filtered);
    }
  };

  const handleEdit = (student) => {
    setEditStudent({ ...student });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const updatedStudent = {
      ...editStudent,
      branchId: editStudent.branchId?._id || editStudent.branchId
    };

    fetch(`https://points-system-backend-6zon.vercel.app/api/students/${editStudent.studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedStudent),
    })
      .then((response) => response.json())
      .then(() => {
        // קריאה מחדש של כל התלמידים לאחר עדכון
        fetch('https://points-system-backend-6zon.vercel.app/api/students')
          .then((response) => response.json())
          .then((data) => {
            setStudents(data);
            setFilteredStudents(data);
            showAlert('התלמיד עודכן בהצלחה!', 'success');
          });
      })
      .catch((error) => {
        console.error('Error updating student:', error);
        showAlert('שגיאה בעדכון תלמיד.', 'danger');
      });
    setShowEditModal(false);
  };

  const handleDelete = (studentId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את התלמיד?')) {
      fetch(`https://points-system-backend-6zon.vercel.app/api/students/${studentId}`, { method: 'DELETE' })
        .then((response) => response.json())
        .then(() => {
          setFilteredStudents(filteredStudents.filter(student => student.studentId !== studentId));
          showAlert('התלמיד נמחק בהצלחה!', 'success');
        })
        .catch((error) => {
          console.error('Error deleting student:', error);
          showAlert('שגיאה במחיקת תלמיד.', 'danger');
        });
    }
  };

  return (
    <div className="container mt-2">
      <div className="text-center mb-2 mt-1">
        <h2 className="mb-0">רשימת תלמידים</h2>
      </div>
      {alert.show && (
        <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert({ show: false, message: '', type: '' })} />
      )}
      <div className="d-flex justify-content-center mb-2">
        <select 
          id="branchFilter" 
          className="form-select form-select-sm" 
          value={selectedBranch} 
          onChange={handleBranchChange}
          style={{ maxWidth: '200px' }}
        >
          <option value="">הצג את כל הסניפים</option>
          {branches.map(branch => (
            <option key={branch._id} value={branch.branchName}>{branch.branchName}</option>
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
                <th>מספר תלמיד</th>
                <th>שם פרטי</th>
                <th>שם משפחה</th>
                <th>סניף</th>
                <th>נקודות</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.branchId?.branchName}</td>
                    <td>{student.totalPoints}</td>
                    <td>
                      <Edit size={20} className="me-2" style={{ cursor: 'pointer' }} onClick={() => handleEdit(student)} />
                      <Trash2 size={20} style={{ cursor: 'pointer' }} onClick={() => handleDelete(student.studentId)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">לא נמצאו תלמידים</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* מודל עריכה מותאם אישית */}
      {showEditModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">ערוך תלמיד</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                {editStudent && (
                  <form>
                    <div className="mb-3">
                      <label className="form-label">שם פרטי</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editStudent.firstName}
                        onChange={(e) => setEditStudent({ ...editStudent, firstName: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">שם משפחה</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editStudent.lastName}
                        onChange={(e) => setEditStudent({ ...editStudent, lastName: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">סניף</label>
                      <select
                        className="form-select"
                        value={editStudent.branchId?._id || editStudent.branchId || ''}
                        onChange={(e) => setEditStudent({ ...editStudent, branchId: e.target.value })}
                      >
                        {branches.map(branch => (
                          <option key={branch._id} value={branch._id}>{branch.branchName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">נקודות</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editStudent.totalPoints}
                        onChange={(e) => setEditStudent({ ...editStudent, totalPoints: parseInt(e.target.value) })}
                      />
                    </div>
                  </form>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  ביטול
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>
                  שמור שינויים
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
