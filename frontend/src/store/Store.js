import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'

const stores= configureStore({
    reducers:{
        slice1: authSlice
    }
})

export default stores;