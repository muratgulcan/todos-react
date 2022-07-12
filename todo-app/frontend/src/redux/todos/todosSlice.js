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

export const todosSlice = createSlice({
    name:'todos',
    initialState:{
        items:[],
        activeFilter:'all',
        isLoading:false,
        error:null,
        addNewTodoLoading:false,
        addNewTodoError:null
    },
    reducers:{
        toggle:(state,action) => {
            const {id} = action.payload;
            const item = state.items.find(item => item.id === id);
            item.completed = !item.completed;
        },
        destroy:(state,action) => {
            const id = action.payload;
            const filtered = state.items.filter((item) => item.id !== id);
            state.items = filtered;

        },
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
            state.addNewTodoLoading = true;
        },
        [addTodosAsync.fulfilled]:(state,action) => {
            state.items.push(action.payload);
            state.addNewTodoLoading = false;
        },
        [addTodosAsync.rejected]:(state,action) => {
            state.addNewTodoLoading = false;
            state.addNewTodoError = action.error.message;
        },
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

export const {toggle,destroy,changeActiveFilter,clearCompleted} = todosSlice.actions
export default todosSlice.reducer;