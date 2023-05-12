import { csrfFetch } from "./csrf";

const GET_EVENTS_BY_GROUPID = 'events/:groupId';
const GET_ALL_EVENTS = 'events/all';
const CREATE_NEW_EVENT = 'events/new';
const GET_SINGLE_EVENT = 'events/:eventId'; 
const DELETE_EVENT = 'events/delete'

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

const newEvent = (data) => {
    return {
        type: CREATE_NEW_EVENT,
        payload: data
    }
}

const singleEvent = (data) => {
    return {
        type: GET_SINGLE_EVENT, 
        payload: data
    }
}

const removeEvent = (data) => {
    return {
        type: DELETE_EVENT, 
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
    return { error: "Something went wrong" };
}

export const fetchAllEvents = () => async (dispatch) => {
    const res = await fetch('/api/events');
    if (res.ok) {
        const data = await res.json();
        dispatch(getEventsByGroupId(data));
        return data;
    }
}

export const postNewEvent = ({ name, type, price, description, startDate, endDate, groupId, url }) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/events/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            venueId: 1,
            name,
            type,
            capacity: 100,
            price,
            description,
            startDate,
            endDate
        })
    })
    
    if (res.ok) {
        const data = await res.json();
        data.previewImage = url; 
        console.log(data); 
        const res2 = csrfFetch(`/api/events/${data.id}/images`, {
            headers: {"Content-Type": "application/json"}, 
            method: "POST", 
            body: JSON.stringify({
                url, 
                preview: true
            })
        })
        dispatch(newEvent(data));
        return data;
    }
    return { error: "Something went wrong" };
}

export const fetchSpecificEvent = (eventId) => async (dispatch) => {
    const res = await fetch(`/api/events/${eventId}`); 
    if (res.ok) {
        const data = await res.json(); 
        dispatch(singleEvent(data)); 
        return data; 
    }
    return {error: "Something went wrong"}
}

export const deleteEvent = (eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`, {
        headers: {"Content-Type": "application/json"}, 
        method: "DELETE"
    })
    if (res.ok) {
        const data  = await res.json(); 
        dispatch(removeEvent(eventId)); 
        return data; 
    }
    return {error: "Something went wrong"}; 
}


const initialState = {
    allEvents: {}, 
    singleEvent: {}
}

const eventsReducer = (state = initialState, action) => {
    const newState = { ...state };
    console.log(newState === state)
    console.log(newState == state)
    switch (action.type) {
        case GET_EVENTS_BY_GROUPID:
            newState.count = action.payload.count; 
            for (let i = 0; i < action.payload.Events.length; i++) {
                const newId = action.payload.Events[i].id
                newState.allEvents[newId] = {...action.payload.Events[i], Group: {...action.payload.Events[i].Group}, Venue: {...action.payload.Events[i].Venue}}
            } 
            return newState;
        case GET_ALL_EVENTS:
            // newState.allEvents
            return newState;
        case CREATE_NEW_EVENT:
            newState.allEvents[action.payload.id] = {...action.payload}; 
            return newState; 

        case GET_SINGLE_EVENT: 
            newState.singleEvent = {...action.payload}; 
            return newState; 
            
        case DELETE_EVENT: 
            newState.singleEvent = {}; 
            Reflect.deleteProperty(newState.allEvents, action.payload)
            return newState; 
        default:
            return state;
    }
}

export default eventsReducer; 