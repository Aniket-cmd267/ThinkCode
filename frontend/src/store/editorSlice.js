import {  createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../utils/axiosClient'

const getProblem= createAsyncThunk(
    'problem/fetch',
    async (problemId, {rejectWithValue}) =>{
        try{
            const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
            // console.log(data)
            return data
        }catch(err){
            return rejectWithValue(err.response.data)
        }
    }
)   
const storeCode= createSlice({
    name: 'editor',
    initialState: {
        problemData: null,
        updatedCode: {},
        // load: false,
        error: null,
        // problemId: 
        // loading: false
    },
    reducers: {
        getCodeWrittenOnEditor: (state,action) =>{
            const {selectedLanguage, value}= action.payload
            // console.log('Redux',action.payload)
            // state.load= true
            state.updatedCode[selectedLanguage]= value
        },
        changeLoadState: (state) =>{
            // state.load= false
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(getProblem.pending, (state) =>{
            state.error= null
        })
        .addCase(getProblem.fulfilled, (state,action) =>{
            const data= action.payload
            state.problemData= data
            data?.startCode?.forEach((code) =>{
                if(!state.updatedCode[code?.language])
                    state.updatedCode[code?.language]= code?.initialCode
            })
            state.error= null
        })
        .addCase(getProblem.rejected, (state,action) =>{
            // state.loading= false,
            state.error= action.payload?.message || "Something went wrong"
        })
    }                                     
})
export default storeCode.reducer;
export const {getCodeWrittenOnEditor, changeLoadState}= storeCode.actions;
export {getProblem};