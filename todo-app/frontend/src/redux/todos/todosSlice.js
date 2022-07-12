import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const getTodosAsync = createAsyncThunk('todos/getTodosAsync',async() => {
    const res = await axios(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`);
    return await res.data;
})

export const addTodosAsync = createAsyncThunk('todos/addTodosAsync',async(data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`,data);
    return await res.data;
})

export const toggleTodoAsync = createAsyncThunk('todos/toggleTodoaAsync', async({id,data}) => {
    const res = await axios.patch(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`,data);
    return await res.data;
})

export const removeTodoAsync = createAsyncThunk('todos/removeTodoAsync', async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`);
    return await id;
})

export const todosSlice = createSlice({
    name:'todos',
    initialState:{
        items:[],
        activeFilter:'all',
        isLoading:false,
        error:null,
        addNewTodo:{
            isLoading:false,
            error:false
        }
    },
    reducers:{
        changeActiveFilter:(state,action) => {
            state.activeFilter = action.payload;
        },
        clearCompleted:(state) => {
            const filtered = state.items.filter((item) => item.completed === false);
            state.items = filtered;
        }
    },
    extraReducers:{
        //get todo
        [getTodosAsync.pending]:(state,action) => {
            state.isLoading = true;
        },
        [getTodosAsync.fulfilled]:(state,action) => {
            state.items = action.payload;
            state.isLoading = false;
        },
        [getTodosAsync.rejected]:(state,action) => {
            state.isLoading = false;
            state.error = action.error.message;
        },
        //add todo
        [addTodosAsync.pending]:(state,action) => {
            state.addNewTodo.isLoading = true;
        },
        [addTodosAsync.fulfilled]:(state,action) => {
            state.items.push(action.payload);
            state.addNewTodo.isLoading = false;
        },
        [addTodosAsync.rejected]:(state,action) => {
            state.addNewTodo.isLoading = false;
            state.addNewTodo.error = action.error.message;
        },
        //toggle todo
        [toggleTodoAsync.fulfilled]:(state,action) => {
            const { id,completed } = action.payload;
            const index = state.items.findIndex(item => item.id === id);
            state.items[index].completed = completed;
        },
        //remove todo
        [removeTodoAsync.fulfilled]:(state,action) => {
            const id = action.payload;
            const filteredIndex = state.items.findIndex((item) => item.id === id);
            state.items.splice(filteredIndex,1)
        }
    }
});

export const selectTodos = (state) => state.todos.items;
export const selectFilteredTodos = (state) => {
    if(state.todos.activeFilter === 'all'){
        return state.todos.items;
    }else{
        return state.todos.items.filter((todo) => 
            state.todos.activeFilter === 'active' ? todo.completed === false : todo.completed ===true
        );
    }
}   

export const {destroy,changeActiveFilter,clearCompleted} = todosSlice.actions
export default todosSlice.reducer;