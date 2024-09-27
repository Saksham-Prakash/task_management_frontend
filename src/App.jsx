import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Update imports
import Signup from './component/Signup';
import Login from './component/Login';
import Dashboard from './component/Dashboard';
import TaskManagement from "./component/TaskManagement";
import UpdateTask from './component/UpdateTask';
import DeleteTask from './component/DeleteTask';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes> {/* Use Routes instead of Switch */}
                    <Route path="/signup" element={<Signup />} /> {/* Use element prop */}
                    <Route path="/login" element={<Login />} /> {/* Use element prop */}
                    <Route path="/" element={<Signup />} />    
                    <Route path="/dashboard" element={<Dashboard />} /> {/* Use element prop */}
                    <Route path="/tasks" element={<TaskManagement />} />
                    <Route path="/update-task" element={<UpdateTask />} />
                    <Route path="/delete-task" element={<DeleteTask />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
