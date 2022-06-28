const defaultState  = {
    count: 0
}

export const globalReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'ACTION_TYPE':
            return 
        default:
            return state
    }
}