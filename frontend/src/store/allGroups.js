import { csrfFetch } from "./csrf";

const GET_GROUPS = "groups/allGroups";
const GET_GROUP_DETAIL = "group/groupDetail";
const CREATE_GROUP = 'group/new'

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
    console.log(privacy, 'true')
    let test = JSON.stringify(privacy); 
    console.log(test, true); 
    test = JSON.parse(test); 
    console.log(test); 
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
        data.previewImage = url; 
        dispatch(createGroup(data))
        return data;
    } else {
        const data = res.json(); 
        console.log('errors', data)
        return res.json();

    }

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
            newState.singleGroup = { ...action.payload };
            return newState;
        case CREATE_GROUP:
            newState.singleGroup = { ...action.group };
        default:
            return state
    }
}

export default groupsReducer; 