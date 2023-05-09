import React, { useEffect, useState } from 'react';
import './GroupDetail.css';
import { NavLink, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchGroups, fetchSpecificGroup } from '../../store/allGroups';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../../store/events';

export default function GroupDetail() {
    const [isLoaded, setIsLoaded] = useState(false);
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

    let previewImage = ''; 

    for (let picture of group.GroupImages) {
        if (picture.preview) {
            previewImage = picture.url; 
        }
    }

    const currentEvents = []; 
    const pastEvents = []; 

    for (let event of events) {
        if (Date.now() < Date.parse(event.endDate)) {
            console.log(event); 
            const day = event.startDate.split('T')
            event.startDay = day[0]; 
            event.startTime = day[1].split('.')[0]; 
            currentEvents.push(event); 
        } else {
            pastEvents.push(event); 
        }
    }
    return (
        <div className='content-wrapper'>
            <h1>Group number: {groupId}</h1>
            <span><NavLink to='/groups'>Groups</NavLink></span>
            <div className='content-header'>
                <img src={previewImage} />
                <div>
                    <h1>{group.name}</h1>
                    <span>{group.city}, {group.state}</span>
                    <span>{events.length} Events</span>
                    <span>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</span>
                    <div className='button-box'><button className='join-group-button'>Join this group</button></div>
                </div>
            </div>
            <div className='detail-box-wrapper'>
                <h2>Organizer</h2>
                <span>{group.Organizer.firstName} {group.Organizer.lastName}</span>
                <h2>What we're about</h2>
                <p>{group.about}</p>
                <h2>{currentEvents.length ? `Upcoming Events (${currentEvents.length})` : null}</h2>
                <div className={'events-box'}>
                    {currentEvents.map((event) => {
                        return (
                            <div className='event-box'>
                                <div>
                                    <img src={event.previewImage} />
                                    <div>
                                        <span>{event.startDay} {event.startTime}</span>
                                        <span>{event.name}</span>
                                        <span>{event.Venue.city}, {event.Venue.state}</span>
                                    </div>
                                </div>
                                <p>{event.description}</p>
                            </div>
                        )
                    })}
                </div>
                <h2>{pastEvents.length ? `Past Events (${pastEvents.length})` : null}</h2>
                <div className={'events-box'}>
                    {pastEvents.map((event) => {
                        return (
                            <div className='event-box'>
                                <div>
                                    <img src={event.previewImage} />
                                    <div>
                                        <span>{event.startDay} {event.startTime}</span>
                                        <span>{event.name}</span>
                                        <span>{event.Venue.city}, {event.Venue.state}</span>
                                    </div>
                                </div>
                                <p>{event.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}