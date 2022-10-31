import { createStore } from "redux";
import addUser from "./reducers/UserReducer";
const store=createStore(addUser);
export default store;