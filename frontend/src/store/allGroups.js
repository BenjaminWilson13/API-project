import { csrfFetch } from "./csrf";

const GET_GROUPS = "groups/allGroups";
const GET_GROUP_DETAIL = "group/groupDetail";
const CREATE_GROUP = 'group/new'; 
const DELETE_GROUP = 'group/delete'; 
const EDIT_GROUP = 'group/edit'; 

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

const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        payload: group
    }
}

const removeGroup = (groupId) => {
    return {
        type: DELETE_GROUP, 
        payload: groupId
    }
}

const editGroup = (group) => {
    return {
        type: EDIT_GROUP, 
        payload: group
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
    return { error: 'Something went Wrong' };
}

export const postCreateGroup = ({ name, about, type, privacy, city, state, url }) => async (dispatch) => {
    
    const res = await csrfFetch(`/api/groups/`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
            name,
            about,
            type,
            private: privacy,
            city,
            state
        })
    });
    if (res.ok) {
        const data = await res.json();
        const imgRes = await csrfFetch(`/api/groups/${data.id}/images`, {
            headers: {"Content-Type": "application/json"}, 
            method: "POST", 
            body: JSON.stringify({
                url, 
                preview: true
            })
        })
        console.log(data)
        data.previewImage = url; 
        dispatch(createGroup(data))
        return data;
    } else {
        const data = res.json(); 
        console.log('errors', data)
        return res.json();

    }

}

export const deleteGroup = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        headers: {"Content-Type": "application/json"}, 
        method: "DELETE", 
    })

    if (res.ok) {
        dispatch(removeGroup(groupId)); 
        return true; 
    }
    return false; 
}

export const putEditGroup = ({ name, about, type, privacy, city, state, url, groupId }) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify({
            name,
            about,
            type,
            private: privacy,
            city,
            state
        })
    });
    if (res.ok) {
        const data = await res.json();
        data.previewImage = url;  
        dispatch(editGroup(data)); 
        return data; 
    }
}

const initialState = {
    allGroups: {},
    singleGroup: {}
};

const groupsReducer = (state = initialState, action) => {
    const newState = { ...state, allGroups: {...state.allGroups}, singleGroup: {...state.singleGroup} };
    switch (action.type) {
        case GET_GROUPS:
            newState.allGroups = {}; 
            for (let i = 0; i < action.payload.Groups.length; i++) {
                const newId = action.payload.Groups[i].id
                newState.allGroups[newId] = action.payload.Groups[i]
            }
            return newState
            
        case GET_GROUP_DETAIL:
            newState.singleGroup = {}; 
            newState.singleGroup = {...action.payload};
            return newState;

        case CREATE_GROUP:
            console.log(action.payload)
            newState.singleGroup = {};
            newState.allGroups[action.payload.id] = {...action.payload}
            return newState; 

        case DELETE_GROUP: 
            newState.singleGroup = {}; 
            Reflect.deleteProperty(newState.allGroups, action.payload); 
            return newState; 

        case EDIT_GROUP: 
            newState.allGroups[action.payload.id] = {...action.payload}; 
            return newState; 
            
        default:
            return state
    }
}

export default groupsReducer; 