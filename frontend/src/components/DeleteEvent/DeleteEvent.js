import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal.js";
import "./DeleteEvent.css";
import { useHistory } from "react-router-dom";
import { deleteEvent } from "../../store/events.js";

function DeleteEvent() {
    const history = useHistory(); 
    const dispatch = useDispatch(); 
    const event = useSelector(state => state.events.singleEvent);
    const { closeModal } = useModal(); 
    const deleteClick = (e) => {
        e.preventDefault(); 
        dispatch(deleteEvent(event.id)); 
        closeModal(); 
        history.push(`/groups/${event.groupId}`)
    }
    return (
        <div className="border-box">
            <div className="delete-modal">
                <h1>Confirm Delete</h1>
                <span>Are you sure you want to remove this event?</span>
                <div className="button-box">
                    <button onClick={deleteClick} className="confirm-delete">Yes (Delete Event)</button>
                    <button onClick={closeModal} className="reject-delete">No (Keep Event)</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteEvent; 