import React, { useEffect, useState } from 'react';
import './AllGroups.css';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchGroups } from '../../store/allGroups';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../../store/events';
import GroupDetail from '../GroupDetail/GroupDetail';

export default function AllGroups({ picker }) {
    const eventCount = {};
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false)
    const groups = useSelector(state => state.groups.allGroups);
    const events = useSelector(state => state.events.allEvents);
    useEffect(() => {
        dispatch(fetchAllEvents());
        dispatch(fetchGroups());
    }, [dispatch])


    console.log(Object.keys(events).length, Object.keys(groups).length)

    if (!Object.keys(events).length || !Object.keys(groups).length) {
        console.log('Returning Null lol')
        return null;
    }
    for (let event in events) {
        if (eventCount[events[event].groupId] === undefined) eventCount[events[event].groupId] = 1;
        else eventCount[events[event].groupId]++;
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
                            <span>{group.about.length > 100 ? group.about.slice(0, 99) + "..." : group.about}</span>
                            <span>{eventCount[group.id] ? eventCount[group.id] : '0'} Events &#183; {group.private ? 'Private' : 'Public'}</span>
                        </div>
                    </div></NavLink>
                )
            }) : Object.values(events).map((event) => {
                const dateTime = event.startDate.split('T');
                const date = dateTime[0];
                const time = dateTime[1].split('.')[0];
                if (Date.parse(event.startDate) < Date.now()) return null;
                return (
                    <NavLink key={event.id} to={{
                        pathname: `/events/${event.id}`,
                        state: { event: event }
                    }} exact>
                        <div className='display-wrapper' >
                            <div>
                                <img src={event.previewImage} />
                            </div>
                            <div className='text-content-box'>
                                <span>{date} · {time}</span>
                                <h2>{event.name}</h2>
                                {groups[event.groupId] ? (<span>{groups[event.groupId].city}, {groups[event.groupId].state} </span>) : <span>"No Venue"</span>}
                            </div>
                            <p>{event.description.length > 100 ? event.description.slice(0, 99) + '...' : event.description}</p>
                        </div>
                    </NavLink>
                )
            })}
        </div>
    )
}