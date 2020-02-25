import axios from 'axios'

const initialState = {
    user: []
}

const ADD_USER = 'ADD_USER';

export const addUser = () => {
    return {
        type: ADD_USER,
        payload: axios.post('/auth/googleUser', {
            
        })
    }
}