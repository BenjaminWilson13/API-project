const GET_GROUPS = "groups/allGroups";
const GET_GROUP_DETAIL = "group/groupDetail"; 

const getGroups = (data) => {
    return {
        type: GET_GROUPS,
        payload: data
    }
}

const getGroup = (data) => {
    return {
        type: GET_GROUP_DETAIL, 
        payload: data
    }
}

export const fetchGroups = () => async (dispatch) => {
    const res = await fetch('/api/groups');
    if (res.ok) {
        const data = await res.json();
        dispatch(getGroups(data));
        return data;
    }
    return { error: 'Something went Wrong' };
}

export const fetchSpecificGroup = (groupId) => async (dispatch) => {
    const res = await fetch(`/api/groups/${groupId}`); 
    if (res.ok) {
        const data = await res.json(); 
        dispatch(getGroup(data)); 
        return data; 
    }
    return {error: 'Something went Wrong'}; 
}

const initialState = {
        allGroups: {}, 
        singleGroup: {}
};

const groupsReducer = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case GET_GROUPS:
            for (let i = 0; i < action.payload.Groups.length; i++) {
                newState.allGroups[i] = action.payload.Groups[i]
            }
            return newState
        case GET_GROUP_DETAIL: 
            newState.singleGroup = {...action.payload}; 
            return newState; 
        default:
            return state
    }
}

export default groupsReducer; 