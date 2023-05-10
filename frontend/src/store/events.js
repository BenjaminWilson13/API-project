const GET_EVENTS_BY_GROUPID = 'events/:groupId';
const GET_ALL_EVENTS = 'events/all' 

const getEventsByGroupId = (data) => {
    return {
        type: GET_EVENTS_BY_GROUPID, 
        payload: data
    }
}

const getAllEvents = (data) => {
    return {
        type: GET_ALL_EVENTS, 
        payload: data
    }
}

export const fetchEventsByGroupId = (groupId) => async (dispatch) => {
    const res = await fetch(`/api/groups/${groupId}/events`); 
    if (res.ok) {
        const data = await res.json(); 
        dispatch(getEventsByGroupId(data)); 
        return data; 
    }
    return {error: "Something went wrong"}; 
}

export const fetchAllEvents = () => async (dispatch) => {
    const res = await fetch('/api/events'); 
    if (res.ok) {
        const data = await res.json(); 
        console.log(data); 
        dispatch(getEventsByGroupId(data)); 
        return data; 
    }
}


const initialState = {
    allEvents: {}
}

const eventsReducer = (state = initialState, action) => {
    const newState = {...state}; 
    switch(action.type) {
        case GET_EVENTS_BY_GROUPID: 
            for (let i = 0; i < action.payload.Events.length; i++) {
                const newId = action.payload.Events[i].id
                newState.allEvents[newId] = action.payload.Events[i]; 
            }
            return newState; 
        case GET_ALL_EVENTS: 
            return null; 
        default: 
            return state; 
    }
}

export default eventsReducer; 