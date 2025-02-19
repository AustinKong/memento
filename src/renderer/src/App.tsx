import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Journal from './components/Journal';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Journal} />
      </Routes>
    </Router>
  );
}

export default App;
