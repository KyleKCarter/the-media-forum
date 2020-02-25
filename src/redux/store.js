import {createStore, applyMiddleware, combineReducers} from 'redux'
import promise from 'redux-promise-middleware'

//reducers
// import authReducer from './reducers/authReducer/authReducer'

const root = combineReducers({
    // authReducer
})

export default createStore(root, applyMiddleware(promise))