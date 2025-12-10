import {createSlice, createAsyncThunk} from 'react-redux'
import axiosClient from '../utils/axiosClient'

// createAsyncThunk has three case --> pending / fulfilled/ rejected and we have to handle all of that (similar to promise)
const registerUser= createAsyncThunk(
    'auth/register', // yeh kuch bhi rkh skte h bas yeh type h joh aage help kregaa jaane mein konsaa addCase trigger huaa
    async (userData, {rejectWithValue}) => { // {rejectWithValue} this comes from thuunkAPI extra features 
        // userData is coming when dispatch triggers the createasyncthunk conatining the data when user click on login
        try{
            const response= await axiosClient.post('/user/register', userData); // creating and sending the data
            return response.data.user; // data is a object contain (user, message) as keys
        }catch(error){
            return rejectWithValue(error);
        }
    }
)

const loginUser= createAsyncThunk(
    'auth/login',
    async( userData, {rejectWithValue}) =>{
        try{
            const response= await axiosClient.post('/user/login', userData);
            return response.data.user;  
        }catch(error){
            return rejectWithValue(error)
        }
    }
)
const authCheck= createAsyncThunk(
    'auth/check',
    async( _, {rejectWithValue}) =>{
        try{
            const {data}= await axiosClient.get('/user/check');
            return data.user;  
        }catch(error){
            return rejectWithValue(error)
        }
    }
)
const logoutUser= createAsyncThunk(
    'auth/logout',
    async( _, {rejectWithValue}) =>{
        try{
            await axiosClient.post('/logout');
            return null;  
        }catch(error){
            return rejectWithValue(error)
        }
    }
)
const authSlice= createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        isAuthenticated: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder)=>{
        builder
        // for register
        .addCase(registerUser.pending, (state)=>{
            state.loading= true,
            state.error= null
        })
        .addCase(registerUser.fulfilled, (state,action) =>{
            state.loading= false,
            state.error= null,
            state.isAuthenticated= !!action.payload
            state.user= action.payload
        })
        .addCase(registerUser.rejected, (state,action) =>{
            state.loading= false,
            state.error= action.payload?.message || "Something went wrong",
            state.isAuthenticated= false
            state.user= null
        })
        // for login
        .addCase(loginUser.pending, (state)=>{
            state.loading= true,
            state.error= null
        })
        .addCase(loginUser.fulfilled, (state,action) =>{
            state.loading= false,
            state.error= null,
            state.isAuthenticated= !!action.payload
            state.user= action.payload
        })
        .addCase(registerUser.rejected, (state,action) =>{
            state.loading= false,
            state.error= action.payload?.message || "Something went wrong",
            state.isAuthenticated= false
            state.user= null
        })

        // for authCheck
        .addCase(authCheck.pending, (state)=>{
            state.loading= true,
            state.error= null
        })
        .addCase(authCheck.fulfilled, (state,action) =>{
            state.loading= false,
            state.error= null,
            state.isAuthenticated= !!action.payload
            state.user= action.payload
        })
        .addCase(authCheck.rejected, (state,action) =>{
            state.loading= false,
            state.error= action.payload?.message || "Something went wrong",
            state.isAuthenticated= false
            state.user= null
        })

        // for logout
        .addCase(logoutUser.pending, (state)=>{
            state.loading= true,
            state.error= null
        })
        .addCase(logoutUser.fulfilled, (state,action) =>{
            state.loading= false,
            state.error= null,
            state.isAuthenticated= false
            state.user= null
        })
        .addCase(registerUser.rejected, (state,action) =>{
            state.loading= false,
            state.error= action.payload?.message || "Something went wrong",
            state.isAuthenticated= false
            state.user= null
        })
    }
})