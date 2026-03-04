import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CourseList from './components/CourseList';
import CourseDetails from './pages/CourseDetails';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/curso/:slug" element={<CourseDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;