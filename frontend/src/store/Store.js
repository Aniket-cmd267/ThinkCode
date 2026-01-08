import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import editorSlice from './editorSlice'

const stores= configureStore({
    reducer:{
        slice1: authSlice,
        slice2: editorSlice
    }
})

export default stores;