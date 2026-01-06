import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'

const stores= configureStore({
    reducer:{
        slice1: authSlice,
    }
})

export default stores;