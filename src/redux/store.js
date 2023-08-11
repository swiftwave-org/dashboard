import { configureStore } from '@reduxjs/toolkit'

// Slices
import configReducer from './features/config/configSlice';
export default configureStore({
  reducer: {
    config: configReducer,
  }
})