import React, { useEffect } from 'react';
import './GroupDetail.css';
import { NavLink, useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchSpecificGroup } from '../../store/allGroups';
import { useDispatch, useSelector } from 'react-redux';
import OpenModalButton from '../OpenModalButton/index.js';
import DeleteGroup from '../DeleteGroupModal';
import { fetchEventsByGroupId } from '../../store/events';

export default function GroupDetail() {
    const history = useHistory();
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const group = useSelector(state => state.groups.singleGroup);
    const eventsObj = useSelector(state => state.events.allEvents)

    useEffect(() => {
        if (group.id !== parseInt(groupId)) {
            dispatch(fetchEventsByGroupId(groupId));
            dispatch(fetchSpecificGroup(groupId));
        }
    }, [dispatch])

    if ((!Object.keys(eventsObj).length && !Object.keys(group).length) || parseInt(groupId) !== group.id) return null;

    const events = Object.values(eventsObj).filter((event) => {
        if (event.groupId === parseInt(groupId)) return true;
        return false;
    })

    let previewImage = '';

    for (let picture of group.GroupImages) {
        if (picture.preview) {
            previewImage = picture.url;
        }
    }

    const currentEvents = [];
    const pastEvents = [];

    for (let event of events) {
        const day = event.startDate.split('T')
        event.startDay = day[0];
        event.startTime = day[1].split('.')[0];
        if (Date.now() < Date.parse(event.startDate)) {
            currentEvents.push(event);
        } else {
            pastEvents.push(event);
        }
    }

    currentEvents.sort((a, b) => {
        return Date.parse(a.startDate) - Date.parse(b.startDate)
    })

    pastEvents.sort((a, b) => {
        return Date.parse(a.startDate) - Date.parse(b.startDate)
    })


    const joinGroup = (e) => {
        alert("Feature coming soon!")
    }

    const editGroup = () => {
        history.push(`/groups/edit/${groupId}`)
    }

    const newEvent = (e) => {
        e.preventDefault();
        history.push(`/events/new/${groupId}`);
    }

    return (
        <>
            <div className='content-wrapper'>
                <span>&#8656; <NavLink to='/groups'>Groups</NavLink></span>
                <div className='content-header'>
                    <img src={previewImage} />
                    <div>
                        <h1>{group.name}</h1>
                        <span>{group.city}, {group.state}</span>
                        <span>{currentEvents.length} Events &#183; {group.type}</span>
                        <span>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</span>
                        {!user ? null : (
                            user.id !== group.Organizer.id ? (<div className='button-box'><button className='join-group-button' onClick={joinGroup}>Join this group</button></div>
                            )
                                :
                                (
                                    <div className='admin-buttons'><button onClick={newEvent}>Create event</button><button onClick={editGroup}>Update</button><OpenModalButton modalComponent={<DeleteGroup />} buttonText={'Delete'} /></div>
                                )
                        )
                        }
                    </div>
                </div>
            </div>
            <div className='gray-background-group'>

                <div className='detail-box-wrapper'>
                    <h2>Organizer</h2>
                    <span>{group.Organizer.firstName} {group.Organizer.lastName}</span>
                    <h2>What we're about</h2>
                    <p>{group.about}</p>
                    <h2>{currentEvents.length ? `Upcoming Events (${currentEvents.length})` : `No Upcoming Events`}</h2>
                    <div className={'events-box'}>
                        {currentEvents.map((event) => {
                            return (
                                <NavLink to={`/events/${event.id}`}>

                                    <div className='event-box' key={event.id}>
                                        <div>
                                            <img src={event.previewImage} />
                                            <div>
                                                <span>{event.startDay} &#183; {event.startTime}</span>
                                                <span>{event.name}</span>
                                                <span>{group.city}, {group.state}</span>
                                            </div>
                                        </div>
                                        <p>{event.description}</p>
                                    </div>
                                </NavLink>
                            )
                        })}
                    </div>
                    <h2>{pastEvents.length ? `Past Events (${pastEvents.length})` : null}</h2>
                    <div className={'events-box'}>
                        {pastEvents.map((event) => {
                            return (
                                <NavLink to={`/events/${event.id}`}>

                                    <div className='event-box' key={event.id}>
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
                                </NavLink>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}