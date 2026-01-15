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
// const storeChatInBackend= createAsyncThunk(
//     'code/backend',
//     async ({chatHistory,problemId},{rejectWithValue}) =>{
//         try{
//             const {data}= await axiosClient.post(`/ai/chat/${problemId}`, chatHistory)
//             return data;
//         }catch(err){
//             return rejectWithValue(err.response.data);
//         }
//     }
// )
const sendChatMsg= createAsyncThunk(
    'send/chat',
    async ({updatedMessage, problem}, {rejectWithValue}) =>{
        try{
            // console.log(updatedMessage)
            const {data}=await axiosClient.post('/ai/chat', {updatedMessage, problem})
            // console.log(data)
            return data;
        }catch(err){
            return rejectWithValue(err.response.data);
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
        chatHistory: []
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
        addUserMsg: (state, action) =>{
            state.chatHistory.push(action.payload)
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
        .addCase(sendChatMsg.pending, (state) =>{
            state.error= null;
        })
        .addCase(sendChatMsg.fulfilled, (state, action) =>{
            console.log('Action: ',action.payload.message)
            state.error= null
            state.chatHistory.push({role: 'model', parts: [{text: action.payload.message}]})
        })
        .addCase(sendChatMsg.rejected, (state,action) =>{
            state.error= !!action.payload
        })
    }                                     
})
export default storeCode.reducer;
export const {getCodeWrittenOnEditor, changeLoadState, addUserMsg}= storeCode.actions;
export {getProblem, sendChatMsg};