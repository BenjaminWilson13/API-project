import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { fetchSpecificEvent } from "../../store/events";
import { fetchSpecificGroup } from "../../store/allGroups";
import './EventDetail.css'
function EventDetail() {
    const dispatch = useDispatch();
    const event = useSelector(state => state.events.singleEvent);
    const group = useSelector(state => state.groups.singleGroup);
    const { eventId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const groupId = event.groupId;
    
    useEffect(() => {
        dispatch(fetchSpecificEvent(eventId));
        const time = setTimeout(() => {

            dispatch(fetchSpecificGroup(groupId));
            setIsLoaded(true);

        }, 700)
        return () => clearInterval(time);
    }, [dispatch])

    if (!isLoaded || !group.Organizer) return null;

    return (
        <div className="content-wrapper">
            <NavLink to='/events'>Events</NavLink>
            <h1>Event number: {eventId}</h1>
            <h2>{event.name}</h2>
            <span>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</span>
            <div className="event-display">
                <div className="event-display-upper">
                    <img src="" />
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
                                    <span>Start</span>
                                    <span>End</span>
                                </div>
                                <div>
                                    <span>{event.startDate}</span>
                                    <span>{event.endDate}</span>
                                </div>
                            </div>
                            <div>

                            </div>
                            <div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventDetail; 