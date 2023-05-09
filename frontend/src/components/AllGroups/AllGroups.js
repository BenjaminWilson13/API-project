import React, { useEffect, useState } from 'react';
import './AllGroups.css';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchGroups } from '../../store/allGroups';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../../store/events';
import GroupDetail from '../GroupDetail/GroupDetail';

export default function AllGroups({ picker }) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false)
    const groups = useSelector(state => state.groups.allGroups);
    const events = useSelector(state => state.events.allEvents);
    useEffect(() => {
        dispatch(fetchGroups());
        dispatch(fetchAllEvents());
        const time = setTimeout(() => {
            for (let event in events) {
                if (groups[event].eventCount === undefined) {
                    groups[event].eventCount = 1;
                } else {
                    groups[event].eventCount++;
                }
            }
            setIsLoaded(true);
        }, 500)
        return () => clearInterval(time);
    }, [dispatch])

    

    if (!isLoaded) {
        return null;
    }

    return (
        <div className='content-wrapper'>
            <div className='event-group-link-box'>
                {picker !== 'Event' ? (<h1><NavLink to='/events'>Events</NavLink></h1>) : (<h1>Events</h1>)}
                {picker !== 'Group' ? (<h1><NavLink to='/groups'>Groups</NavLink></h1>) : (<h1>Groups</h1>)}
            </div>
            <p className='tag-line'>Groups in Meetup</p>
            {picker === "Group" ? Object.values(groups).map((group) => {
                return (
                    <NavLink key={group.id} to={`/groups/${group.id}`}><div className='display-wrapper' id={group.id}>
                        <div>
                            <img src={group.previewImage} />
                        </div>
                        <div className='text-content-box'>
                            <h2>{group.name}</h2>
                            <span>{group.city}, {group.state}</span>
                            <span>{group.about}</span>
                            <span>{group.eventCount} Events    {group.private ? 'Private' : 'Public'}</span>
                        </div>
                    </div></NavLink>
                )
            }) : Object.values(events).map((event) => {
                const dateTime = event.startDate.split('T');
                const date = dateTime[0]
                const time = dateTime[1].split('.')[0]

                console.log(dateTime); 
                console.log('full', event.startDate); 
                return (
                    <div className='display-wrapper' key={event.id}>
                        <div>
                            <img src={event.previewImage} />
                        </div>
                        <div className='text-content-box'>
                            <span>{date} · {time}</span>
                            <h2>{event.name}</h2>
                            {event.Venue ? (<span>{event.Venue.city}, {event.Venue.state} </span>): <span>"No Venue"</span>}
                        </div>
                        <p>{event.description}</p>
                    </div>
                )
            })}
        </div>
    )
}