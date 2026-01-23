import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import PlannerPage from './pages/PlannerPage';
import ProgressPage from './pages/ProgressPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="progress" element={<ProgressPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
