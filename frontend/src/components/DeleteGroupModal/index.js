import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal.js";
import "./DeleteGroup.css";
import { useHistory } from "react-router-dom";
import { deleteGroup } from "../../store/allGroups.js";

function DeleteGroup() {
    const history = useHistory(); 
    const dispatch = useDispatch(); 
    const group = useSelector(state => state.groups.singleGroup);
    const { closeModal } = useModal(); 
    const deleteClick = (event) => {
        event.preventDefault(); 
        dispatch(deleteGroup(group.id)); 
        closeModal(); 
        history.push('/groups')
    }
    return (
        <div className="border-box">
            <div className="delete-modal">
                <h1>Confirm Delete</h1>
                <span>Are you sure you want to remove this group?</span>
                <div className="button-box">
                    <button onClick={deleteClick} className="confirm-delete">Yes (Delete Group)</button>
                    <button onClick={closeModal} className="reject-delete">No (Keep Group)</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteGroup; 