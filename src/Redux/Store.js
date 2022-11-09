import { combineReducers, createStore } from "redux";
import { addUser, dataTable } from "./reducers/UserReducer";
const rootReducer = combineReducers(
    { addUser: addUser, dataTable: dataTable }
)

const store = createStore(rootReducer);
export default store;