import React, { useState } from 'react';
import Menu from './components/Menu';
import StudentList from './components/StudentList';
import SearchResults from './components/SearchResults';
import AddPoints from './components/AddPoints';
import UpdateParents from './components/UpdateParents';
import Navbar from './components/Navbar';
import AddStudent from './components/AddStudent'; // ייבוא רכיב הוספת תלמיד
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles.css';

function App() {
  const [page, setPage] = useState('menu');
  const [searchId, setSearchId] = useState('');

  const renderPage = () => {
    if (page === 'list') {
      return <StudentList />;
    } else if (page === 'searchResults') {
      return <SearchResults searchId={searchId} />;
    } else if (page === 'addPoints') {
      return <AddPoints />;
    } else if (page === 'updateParents') {
      return <UpdateParents />;
    } else if (page === 'addStudent') { // ניווט לדף הוספת תלמיד
      return <AddStudent onStudentAdded={() => setPage('list')} />;
    } else {
      return <Menu setPage={setPage} />;
    }
  };

  return (
    <div className="App">
      {/* הצגת ה-Navbar */}
      <Navbar setPage={setPage} setSearchId={setSearchId} />

      {/* הצגת העמוד הנבחר */}
      <div style={{ paddingTop: '60px' }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
