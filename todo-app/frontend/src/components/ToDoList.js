import React,{useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {selectFilteredTodos,getTodosAsync,toggleTodoAsync,removeTodoAsync} from '../redux/todos/todosSlice'
import Error from './Error';
import Loading from './Loading';


function ToDoList() {
    const dispatch = useDispatch();
    const filteredTodos = useSelector(selectFilteredTodos);
    const isLoading = useSelector(state => state.todos.addNewTodo.isLoading);
    const error = useSelector(state => state.todos.addNewTodo.error);
    useEffect(() => {
        dispatch(getTodosAsync());
    },[dispatch]);

    const handleDestroy = async (id) => {
        await dispatch(removeTodoAsync(id))  
    }

    const handleToggle = async (id,completed) => {
        await dispatch(toggleTodoAsync({id,data:{completed}}));
    }

    if(isLoading){
        return <Loading/>
    }
    if(error){
        return <Error message={error} />
    }
  return (
    <ul className="todo-list">
        {
            filteredTodos.map((item)=>(
                <li key={item.id} className={item.completed ? 'completed' : ''}>
                    <div className="view">
                        <input className="toggle" type="checkbox" onChange={() => handleToggle(item.id,!item.completed)} checked={item.completed} />
                        <label>{item.title}</label>
                        <button className="destroy" onClick={() => handleDestroy(item.id)} ></button>
                    </div>
                </li>
            ))
        }
    </ul>
  )
}

export default ToDoList