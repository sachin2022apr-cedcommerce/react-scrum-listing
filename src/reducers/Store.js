import { createStore } from "redux";
import addUser from "./UserReducer";
const store=createStore(addUser);
export default store;