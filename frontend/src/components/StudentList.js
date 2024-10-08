import React, { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

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
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setLoading(false);
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

  const handleEdit = (student) => {
    setEditStudent({ ...student });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    fetch(`http://localhost:5000/api/students/${editStudent.studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editStudent),
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents(students.map((student) => (student.studentId === editStudent.studentId ? editStudent : student)));
        setFilteredStudents(filteredStudents.map((student) => (student.studentId === editStudent.studentId ? editStudent : student)));
        alert('התלמיד עודכן בהצלחה!');
      })
      .catch((error) => {
        console.error('Error updating student:', error);
        alert('שגיאה בעדכון תלמיד.');
      });
    setShowEditModal(false);
  };

  const handleDelete = (studentId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את התלמיד?')) {
      fetch(`http://localhost:5000/api/students/${studentId}`, { method: 'DELETE' })
        .then((response) => response.json())
        .then(() => {
          setFilteredStudents(filteredStudents.filter(student => student.studentId !== studentId));
          alert('התלמיד נמחק בהצלחה!');
        })
        .catch((error) => {
          console.error('Error deleting student:', error);
          alert('שגיאה במחיקת תלמיד.');
        });
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
                    <td>{student.branch}</td>
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
                        value={editStudent.branch}
                        onChange={(e) => setEditStudent({ ...editStudent, branch: e.target.value })}
                      >
                        {branches.map(branch => (
                          <option key={branch} value={branch}>{branch}</option>
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
