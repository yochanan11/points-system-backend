import React, { useState } from 'react';
import Menu from './components/Menu';
import StudentList from './components/StudentList';
import SearchResults from './components/SearchResults';
import AddPoints from './components/AddPoints';
import UpdateParents from './components/UpdateParents';
import Navbar from './components/Navbar';
import AddStudent from './components/AddStudent'; // הוספת ייבוא עבור דף הוספת תלמיד
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
    } else if (page === 'addStudent') { // הוספת תנאי לדף הוספת תלמיד
      return <AddStudent />;
    } else {
      return <Menu setPage={setPage} />;
    }
  };

  return (
    <div className="App d-flex flex-column min-vh-100">
      <Navbar setPage={setPage} setSearchId={setSearchId} />

      <div style={{ paddingTop: '60px', flex: '1' }}>
        {renderPage()}
      </div>

      <footer
        style={{
          backgroundColor: '#03454e',
          color: '#ffffff',
          textAlign: 'center',
          padding: '10px',
          fontSize: '14px',
          position: 'sticky',
          bottom: '0',
        }}
      >
        פיתוח: יוחנן שבדרון
      </footer>
    </div>
  );
}

export default App;
