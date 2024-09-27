import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams to get taskId

const UpdateTask = () => {
    const { taskId } = useParams(); // Get taskId from URL parameters
    const [task, setTask] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchTask = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized. Please log in.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/tasks/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTask(response.data);
            } catch (err) {
                if (err.response) {
                    setError(err.response.data || 'An error occurred while fetching the task.');
                } else {
                    setError('Network error. Please try again later.');
                }
            }
        };

        fetchTask(); // Fetch the task when the component mounts
    }, [taskId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handleUpdateTask = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized. Please log in.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8080/api/tasks/${taskId}`, task, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('Task updated successfully!');
            navigate('/'); // Navigate back to the dashboard or another route
        } catch (err) {
            if (err.response) {
                setError(err.response.data || 'An error occurred while updating the task.');
            } else {
                setError('Network error. Please try again later.');
            }
        }
    };

    if (!task) {
        return <p>Loading...</p>; // Show loading state while fetching the task
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Update Task</h1>
            {error && <p className="text-red-500">{error}</p>}

            <input
                type="text"
                name="title"
                value={task.title}
                onChange={handleChange}
                className="border p-2 mb-2 w-full"
                placeholder="Title"
                required
            />
            <textarea
                name="description"
                value={task.description}
                onChange={handleChange}
                className="border p-2 mb-2 w-full"
                placeholder="Description"
                required
            />
            <input
                type="datetime-local"
                name="dueDate"
                value={task.dueDate.split('T')[0]} // Adjust if needed to match expected format
                onChange={handleChange}
                className="border p-2 mb-2 w-full"
                required
            />
            <select
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="border p-2 mb-2 w-full"
                required
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <button
                onClick={handleUpdateTask}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Update Task
            </button>
        </div>
    );
};

export default UpdateTask;