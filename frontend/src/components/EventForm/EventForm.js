import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./EventForm.css"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { postNewEvent } from '../../store/events';

function EventForm({ mode }) {
    const dispatch = useDispatch(); 
    const history = useHistory(); 
    const group = useSelector(state => state.groups.singleGroup);
    const groupId = group.id; 
    const [name, setName] = useState('');
    const [type, setType] = useState(undefined);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [url, setUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false); 

    async function handleSubmit(e) {
        e.preventDefault();
        const error = {};
        setSubmitted(true); 
        if (name.length < 5) error.name = 'Name is required';
        if (type === undefined) error.type = "Type must be Online or In person";
        if (price < 1) error.price = 'Price is required';
        if (description.length < 30) error.description = 'Description must be at least 30 characters long';
        if (!startDate || !Number.isInteger(Date.parse(startDate))) error.startDate = 'Event start is required';
        if (!endDate || !Number.isInteger(Date.parse(endDate))) error.endDate = 'Event end is required';
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
                    groupId
                }))
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
                <span>What is the name of your event? </span>

                <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Event Name' />
                {errors.name ? <span className='span-error'>{errors.name}</span> : null}
                <hr />
                <span>Is this an in person or online event?</span>

                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value={undefined}>(select one)</option>
                    <option value={'Online'}>Online</option>
                    <option value={'In person'}>In person</option>
                </select>
                {errors.type ? <span className='span-error'>{errors.type}</span> : null}

                <span>What is the price of your event?</span>

                <input type='number' min={0} max={999} step={0.01} placeholder='0' value={price} onChange={(e) => setPrice(e.target.value)} />
                {errors.price ? <span className='span-error'>{errors.price}</span> : null}

                <hr />
                <span>When does your event start?</span>

                <input type='datetime-local' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                {errors.startDate ? <span className='span-error'>{errors.startDate}</span> : null}

                <span>When does your event end?</span>

                <input type='datetime-local' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                {errors.endDate ? <span className='span-error'>{errors.endDate}</span> : null}

                <hr />
                <span>Please add in image url for your event below:</span>

                <input type='url' placeholder='Image URL' value={url} onChange={e => setUrl(e.target.value)} />
                {errors.url ? <span className='span-error'>{errors.url}</span> : null}

                <hr />
                <span>Please describe your event:</span>

                <textarea placeholder='Please include at least 30 characters' value={description} onChange={e => setDescription(e.target.value)} />
                {errors.description ? <span className='span-error'>{errors.description}</span> : null}

                <button type='Submit'>Create Event</button>
            </form>

        </div>
    )
}

export default EventForm; 