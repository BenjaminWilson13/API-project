import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { fetchSpecificEvent } from "../../store/events";
import { fetchSpecificGroup } from "../../store/allGroups";
import './EventDetail.css'
import OpenModalButton from "../OpenModalButton";
import DeleteEvent from "../DeleteEvent/DeleteEvent";

function EventDetail() {
    const dispatch = useDispatch();
    const event = useSelector(state => state.events.singleEvent);
    const group = useSelector(state => state.groups.singleGroup);
    const user = useSelector(state => state.session.user);
    const [isLoaded, setIsLoaded] = useState(false);
    const { eventId } = useParams();
    let startDay;
    let startTime;
    let endDay;
    let endTime;
    useEffect(() => {
        if (event.id !== parseInt(eventId)) {
            dispatch(fetchSpecificEvent(eventId));
        }
    }, [dispatch])

    useEffect(() => {
        if (event.groupId && group.id !== event.groupId) {
            dispatch(fetchSpecificGroup(event.groupId));
        }
    }, [event])

    if (!group.Organizer || !event.startDate || event.id !== parseInt(eventId) || event.groupId !== group.id) return null;
    startDay = event.startDate.split('T');
    startTime = startDay[1].split('.')[0];
    startDay = startDay[0];

    endDay = event.endDate.split('T');
    endTime = endDay[1].split('.')[0];
    endDay = endDay[0];

    return (
        <>
            <div className="content-wrapper">
                <span>&#8656; <NavLink to='/events'>Events</NavLink></span>
                <h2>{event.name}</h2>
                <span>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</span>
            </div>
            <div className="gray-background">
                <div className="event-display">
                    <div className="event-display-upper">
                        <img src={event.EventImages[0]?.url} />
                        <div>
                            <div className="event-display-upper-inner-right">
                                <img src={group.GroupImages[0].url} />
                                <div className="group-name-div">
                                    <span>{group.name}</span>
                                    <span>{group.private ? "Private" : "Public"}</span>
                                </div>
                            </div>
                            <div className="event-display-upper-inner-right-lower">
                                <div>
                                    <i className="fa-regular fa-clock"></i>
                                    <div>
                                        <span>START</span>
                                        <span>END</span>
                                    </div>
                                    <div>
                                        <span>{startDay} &#183; {startTime}</span>
                                        <span>{endDay} &#183; {endTime}</span>
                                    </div>
                                </div>
                                <div>
                                    <i className="fa-solid fa-dollar-sign"></i>
                                    <div>
                                        <span>{event.price === 0 ? "Free" : event.price}</span>
                                    </div>
                                </div>
                                <div>
                                    <i className="fa-solid fa-map-pin"></i>
                                    <div id="event-type-and-delete-button">
                                        <span>{event.type}</span>
                                        {
                                            !user || user.id !== group.organizerId ?
                                                (
                                                    null
                                                )
                                                :
                                                (
                                                    <div className='admin-buttons'><OpenModalButton modalComponent={<DeleteEvent />} buttonText={'Delete'} /> <button>Edit</button></div>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="event-display-lower">
                        <h2>Details</h2>
                        <p>{event.description}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventDetail; 