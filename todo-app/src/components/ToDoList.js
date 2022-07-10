import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {toggle,destroy,selectFilteredTodos} from '../redux/todos/todosSlice'


function ToDoList() {
    const dispatch = useDispatch();
    const filteredTodos = useSelector(selectFilteredTodos);
  return (
    <ul className="todo-list">
        {
            filteredTodos.map((item)=>(
                <li key={item.id} className={item.completed ? 'completed' : ''}>
                    <div className="view">
                        <input className="toggle" type="checkbox" onChange={() => dispatch(toggle({id:item.id}))} checked={item.completed} />
                        <label>{item.title}</label>
                        <button className="destroy" onClick={() => dispatch(destroy(item.id))} ></button>
                    </div>
                </li>
            ))
        }
    </ul>
  )
}

export default ToDoList