// login user
export const getUser=()=>{
    return{
        type:"ADD_USER"
    }
}

// logout user
export const LogoutUser=()=>{
    return{
        type:"LOGOUT"
    }
}

export const tableFilter = (a) => {
    return{
        type:"TABLE_FILTER",
        payload:a
    }
}
