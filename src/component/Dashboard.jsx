import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [error, setError] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('All');
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token'); // Get the token from local storage
            if (!token) {
                setError('Unauthorized. Please log in.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}` // Set the token in the header
                    }
                });
                setTasks(response.data); // Store the tasks in state
                setFilteredTasks(response.data); // Initialize filtered tasks
            } catch (err) {
                if (err.response) {
                    setError(err.response.data || 'An error occurred while fetching tasks.'); // Set error message from response
                } else {
                    setError('Network error. Please try again later.'); // Handle other errors
                }
            }
        };

        fetchTasks(); // Call the function to fetch tasks
    }, []); // Run once on mount

    const handlePriorityChange = (e) => {
        const selected = e.target.value;
        setSelectedPriority(selected);
        if (selected === 'All') {
            setFilteredTasks(tasks); // Show all tasks if 'All' is selected
        } else {
            const filtered = tasks.filter(task => task.priority === selected); // Filter tasks by priority
            setFilteredTasks(filtered);
        }
    };

    const handleCreateTask = () => {
        navigate('/tasks'); // Navigate to the /tasks route
    };

    const handleUpdateTask = (taskId) => {
        localStorage.setItem('taskId', taskId); // Save taskId in local storage
        navigate('/update-task'); // Navigate to the /update-task route
    };

    const handleDeleteTask = async (taskId) => {
        const token = localStorage.getItem('token'); // Get the token from local storage
        if (!token) {
            setError('Unauthorized. Please log in.');
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Set the token in the header
                }
            });
            // Update the local state to remove the deleted task
            setTasks(tasks.filter(task => task.taskId !== taskId));
            setFilteredTasks(filteredTasks.filter(task => task.taskId !== taskId));
            setError(''); // Clear error if any
        } catch (err) {
            if (err.response) {
                setError(err.response.data || 'An error occurred while deleting the task.'); // Set error message from response
            } else {
                setError('Network error. Please try again later.'); // Handle other errors
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Tasks</h1>
            {error && <p className="text-red-500">{error}</p>}
            
            <div className="mb-4">
                <label className="mr-2">Filter by Priority:</label>
                <select 
                    value={selectedPriority} 
                    onChange={handlePriorityChange} 
                    className="border rounded p-2"
                >
                    <option value="All">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            <div className="mb-4">
                <button
                    onClick={handleCreateTask}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                    Create Task
                </button>
            </div>

            {filteredTasks.length === 0 ? ( // Check if filtered tasks array is empty
                <p className="text-gray-500">There are no tasks available.</p>
            ) : (
                <ul>
                    {filteredTasks.map((task) => (
                        <li key={task.taskId} className="border p-4 mb-2 rounded">
                            <h2 className="text-xl font-semibold">{task.title}</h2>
                            <p><strong>Description:</strong> {task.description}</p>
                            <p><strong>Status:</strong> {task.status}</p>
                            {/* <p><strong>Due Date:</strong> {new Date(...task.dueDate).toLocaleString()}</p> */}
                            <p><strong>Priority:</strong> {task.priority}</p>
                            <p><strong>Created At:</strong> {new Date(...task.createdAt).toLocaleString()}</p>
                            <p><strong>Updated At:</strong> {new Date(...task.updatedAt).toLocaleString()}</p>
                            <button
                                onClick={() => handleUpdateTask(task.taskId)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDeleteTask(task.taskId)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;