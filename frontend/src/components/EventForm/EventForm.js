import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./EventForm.css"
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { postNewEvent } from '../../store/events';
import { fetchSpecificGroup } from '../../store/allGroups';

function EventForm({ mode }) {
    const title = document.querySelector('title'); 
    
    
    const dispatch = useDispatch(); 
    const history = useHistory(); 
    const group = useSelector(state => state.groups.singleGroup);
    title.innerText = `Create a new event for ${group.name}`
    const {groupId} = useParams(); 
    const [name, setName] = useState('');
    const [type, setType] = useState(undefined);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [url, setUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false); 

    useEffect(() => {
        dispatch(fetchSpecificGroup(groupId)); 
    }, [dispatch])

    async function handleSubmit(e) {
        e.preventDefault();
        const error = {};
        setSubmitted(true); 
        if (name.length < 5) error.name = 'Name is required';
        if (type === undefined) error.type = "Type must be Online or In person";
        if (price < 0) error.price = 'Price is required';
        if (description.length < 30) error.description = 'Description must be at least 30 characters long';
        if (!startDate || !Number.isInteger(Date.parse(startDate))) error.startDate = 'Event start is required';
        if (!endDate || !Number.isInteger(Date.parse(endDate))) error.endDate = 'Event end is required';
        if (Date.parse(startDate) > Date.parse(endDate)) error.startDate = 'Event start is required'; 
        const splitUrl = url.split('.'); 
        const urlEnd = splitUrl[splitUrl.length - 1]; 
        if (!url || urlEnd !== 'png' && urlEnd !== 'jpg' && urlEnd !== 'jpeg') error.url = 'Image URL must end in .png, .jpg, or .jpeg'; 
        setErrors(error); 
        if (!Object.keys(error).length) {
            if (mode === 'Create') {
                const parsedFloat = parseFloat(price)
                const event = await dispatch(postNewEvent({
                    name, 
                    type, 
                    price: parsedFloat, 
                    description, 
                    startDate, 
                    endDate, 
                    groupId, 
                    url
                }))
                console.log(event)
                history.push(`/events/${event.id}`)
            }
        } else {
            setSubmitted(false); 
            // setErrors({}); 
        }
    }

    return (
        <div className='content-wrapper'>
            <h1>Create an event for {group.name}</h1>
            <form onSubmit={handleSubmit}>
                <h4>What is the name of your event? </h4>

                <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Event Name' />
                {errors.name ? <span className='span-error'>{errors.name}</span> : null}
                <hr />
                <h4>Is this an in person or online event?</h4>

                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value={undefined}>(select one)</option>
                    <option value={'Online'}>Online</option>
                    <option value={'In person'}>In person</option>
                </select>
                {errors.type ? <span className='span-error'>{errors.type}</span> : null}

                <h4>What is the price of your event?</h4>

                <input type='number' min={0} max={999} step={0.01} placeholder='0' value={price} onChange={(e) => setPrice(e.target.value)} />
                {errors.price ? <span className='span-error'>{errors.price}</span> : null}

                <hr />
                <h4>When does your event start?</h4>

                <input type='datetime-local' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                {errors.startDate ? <span className='span-error'>{errors.startDate}</span> : null}

                <h4>When does your event end?</h4>

                <input type='datetime-local' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                {errors.endDate ? <span className='span-error'>{errors.endDate}</span> : null}

                <hr />
                <h4>Please add in image url for your event below:</h4>

                <input type='url' placeholder='Image URL' value={url} onChange={e => setUrl(e.target.value)} />
                {errors.url ? <span className='span-error'>{errors.url}</span> : null}

                <hr />
                <h4>Please describe your event:</h4>

                <textarea placeholder='Please include at least 30 characters' value={description} onChange={e => setDescription(e.target.value)} />
                {errors.description ? <span className='span-error'>{errors.description}</span> : null}

                <button type='Submit'>Create Event</button>
            </form>

        </div>
    )
}

export default EventForm; 