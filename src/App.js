import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './context/TodoContext';
import MainPage from './components/MainPage';
import TaskPage from './components/TaskPage';
import NotFoundPage from './components/NotFoundPage';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/task/:id" element={<TaskPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </TodoProvider>
  );
}

export default App;