import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import JournalPage from './pages/JournalPage';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={JournalPage} />
      </Routes>
    </Router>
  );
}

export default App;
