import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CourseList from './components/CourseList';
import CourseDetails from './pages/CourseDetails';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar /> 
              <div className="pt-16">
                <CourseList />
              </div>
            </>
          } />
          <Route path="/curso/:slug" element={<CourseDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;