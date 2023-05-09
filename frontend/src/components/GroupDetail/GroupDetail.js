import React, { useEffect, useState } from 'react';
import './GroupDetail.css';
import { NavLink, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchGroups, fetchSpecificGroup } from '../../store/allGroups';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../../store/events';

export default function GroupDetail() {
    const [isLoaded, setIsLoaded] = useState(false)
    const dispatch = useDispatch(); 
    const { groupId } = useParams();
    const group = useSelector(state => state.groups.singleGroup);
    const events = Object.values(useSelector(state => state.events.allEvents)).filter((event) => {
        if (event.groupId === parseInt(groupId)) {
            return true;
        }
        return false;
    })

    useEffect(() => {
        dispatch(fetchSpecificGroup(groupId))
        const time = setTimeout(() => {
            setIsLoaded(true);
        }, 500)
        return () => clearInterval(time);
    }, [dispatch])

    if (!isLoaded) return null; 

    console.log(group)
    return (
        <div className='content-wrapper'>
            <h1>Group number: {groupId}</h1>
            <span><NavLink to='/groups'>Groups</NavLink></span>
            <div className='content-header'>
                <img src={group.previewImage} />
                <div>
                    <h1>{group.name}</h1>
                    <span>{group.city}, {group.state}</span>
                    <span>{events.length} Events</span>
                    <span>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</span>
                </div>
            </div>
        </div>
    )
}