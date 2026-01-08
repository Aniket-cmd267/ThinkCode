import {  createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../utils/axiosClient'

// const getProblem= createAsyncThunk(
//     'problem/fetch',
//     async (problemId, {rejectWithValue}) =>{
//         try{
//             const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
//             return data
//         }catch(err){
//             return rejectWithValue(error.response.data)
//         }
//     }
// )
const storeCode= createSlice({
    name: 'editor',
    initialState: {
        // problemData: null,
        updatedCode: {
            'c++': '',
            'java': '',
            'javascript': ''
        },
        load: false,
        // error: null,
        // loading: false
    },
    reducers: {
        getCodeWrittenOnEditor: (state,action) =>{
            const {selectedLanguage, value}= action.payload
            // console.log('Redux',action.payload)
            state.load= true
            state.updatedCode[selectedLanguage]= value
        },
        changeLoadState: (state) =>{
            state.load= false
        }
    },
    // extraReducers: (builder) =>{
    //     builder
    //     .addCase(getProblem.pending, (state) =>{
    //         state.loading= true,
    //         state.error= null
    //     })
    //     .addCase(getProblem.fulfilled, (state,action) =>{
    //         state.loading= false,
    //         state.problemData= action.payload,
    //         state.error= null
    //     })
    //     .addCase(getProblem.rejected, (state,action) =>{
    //         state.loading= false,
    //         state.error= action.payload?.message || "Something went wrong"
    //     })
    // }                                     
})
export default storeCode.reducer;
export const {getCodeWrittenOnEditor, changeLoadState}= storeCode.actions;
// export {getProblem};