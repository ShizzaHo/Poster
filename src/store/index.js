import { globalReducer } from './reducers/global'
import { createStore } from 'redux'

const store = createStore(globalReducer)

export default store
