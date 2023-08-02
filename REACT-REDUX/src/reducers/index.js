import {combineReducers} from 'redux'
import phonebookReducer from './phonebooks'
const rootReducer = combineReducers({
    phonebook: phonebookReducer
})

export default rootReducer