// initial store declaration
const inititalState = {
    user: {}
};
const inititalTable = {
    filter: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
};
// reducer

const filterObj = {
    tags:3,
    type:1,
    variant_attributes:1,
    product_type:3
}
export const addUser = (state = inititalState, action) => {
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

export const dataTable = (state = inititalTable, action) => {
    switch (action.type) {
        case "TABLE_FILTER":
            return {
                ...state,
                filter: addFilter(action.payload, state.filter)
            }
        default:
            return state
    }
}
var addFilter = (payload, filterArray) => {
    var data = filterArray;
    console.log(payload);
    data.forEach((item, index) => {
        console.log(item, index)
        if (payload.index === index) {
            if (payload.type === "condition") {
                data[index] = {
                    property: payload.property,
                    condition: payload?.value ?? filterObj[payload.property],
                    value: data[index]?.value
                }
            }
            if (payload.type === "value") {
                data[index] = {
                    property: payload.property,
                    condition: data[index]?.condition ?? filterObj[payload.property],
                    value: payload.value
                }
            }
        }
    });
    sessionStorage.setItem("fiterData", JSON.stringify(data))
    return [...data]
}
