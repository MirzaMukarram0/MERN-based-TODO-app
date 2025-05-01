import React, { useEffect, useState } from 'react';
import Create from './Create';
import './App.css';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil, BsCheckLg, BsClock, BsX } from 'react-icons/bs';
import { formatDistanceToNow } from 'date-fns';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [updatetask, setUpdatetask] = useState('');
    const [taskid, setTaskid] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, task: '' });

    useEffect(() => {
        axios.get('http://localhost:5000/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    }, []);

    const edit = (id) => {
        axios.put(`http://localhost:5000/edit/${id}`)
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, done: !todo.done };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    const Update = (id, updatedTask) => {
        axios.put(`http://localhost:5000/update/${id}`, { task: updatedTask })
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, task: updatedTask };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
                setTaskid('');
                setUpdatetask('');
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    const showDeleteDialog = (id, task) => {
        setDeleteDialog({ show: true, id, task });
    };

    const hideDeleteDialog = () => {
        setDeleteDialog({ show: false, id: null, task: '' });
    };

    const Hdelete = (id) => {
        axios.delete(`http://localhost:5000/delete/${id}`)
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.filter(todo => todo._id !== id);
                setTodos(updatedTodos);
                hideDeleteDialog();
            })
            .catch(err => console.log(err));
    };

    const formatTimestamp = (timestamp) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
        } catch (error) {
            return 'Unknown time';
        }
    };

    return (
        <main>
            <Create />
            {
                todos.length === 0 ? <div className='task'>No tasks found</div> :
                    todos.map((todo) => (
                        <div className='task' key={todo._id}>
                            <div className='checkbox'>
                                {todo.done ? <BsFillCheckCircleFill className='icon' /> :
                                    <BsCircleFill className='icon' onClick={() => edit(todo._id)} />}
                                <div className='task-content'>
                                    {taskid === todo._id ?
                                        <input 
                                            type='text' 
                                            value={updatetask} 
                                            onChange={e => setUpdatetask(e.target.value)}
                                            className='edit-input'
                                            autoFocus
                                        />
                                        :
                                        <p className={todo.done ? 'through' : 'normal'}>{todo.task}</p>
                                    }
                                    <div className='timestamp'>
                                        <BsClock className='clock-icon' />
                                        <span>{formatTimestamp(todo.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span>
                                    {taskid === todo._id ? (
                                        <BsCheckLg 
                                            className='icon save-icon' 
                                            onClick={() => Update(todo._id, updatetask)} 
                                        />
                                    ) : (
                                        <BsPencil 
                                            className='icon edit-icon' 
                                            onClick={() => {
                                                setTaskid(todo._id);
                                                setUpdatetask(todo.task);
                                            }} 
                                        />
                                    )}
                                    <BsFillTrashFill 
                                        className='icon delete-icon' 
                                        onClick={() => showDeleteDialog(todo._id, todo.task)} 
                                    />
                                </span>
                            </div>
                        </div>
                    ))
            }

            {/* Delete Confirmation Dialog */}
            {deleteDialog.show && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <button className="dialog-close" onClick={hideDeleteDialog}>
                            <BsX />
                        </button>
                        <h3>Delete Task</h3>
                        <p>Are you sure you want to delete this task?</p>
                        <p className="task-preview">{deleteDialog.task}</p>
                        <div className="dialog-buttons">
                            <button 
                                className="dialog-button cancel-button" 
                                onClick={hideDeleteDialog}
                            >
                                Cancel
                            </button>
                            <button 
                                className="dialog-button delete-button" 
                                onClick={() => Hdelete(deleteDialog.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Home;
