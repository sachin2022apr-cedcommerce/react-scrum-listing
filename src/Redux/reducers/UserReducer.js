// initial store declaration
const inititalState = {
    user: {}
};
// reducer
const addUser = (state = inititalState, action) => {
    switch (action.type) {
        //add user
        case "ADD_USER":
            return {
                ...state,
                user: {
                    ...JSON.parse(sessionStorage.getItem('UserLogin'))
                }
            }
        case "LOGOUT":
            return {
                ...state,
                user: {}
            }
        default:
            return state
    }
}

export default addUser;