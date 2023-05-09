import React, { useState } from "react"
import './CreateGroup.css'
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { postCreateGroup } from "../../store/allGroups";

export default function CreateGroup({ group, formType }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [cityState, setCityState] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('Online'); 
    const [privacy, setPrivacy] = useState(false); 
    const [url, setUrl] = useState(''); 

    async function handleSubmit(e) {
        e.preventDefault(); 
        const city = cityState.split(',')[0]; 
        const state = cityState.split(',')[1]; 
        let group = await dispatch(postCreateGroup({
            name, 
            about, 
            type, 
            privacy, 
            city, 
            state
        }))
        console.log(group); 
        history.push(`/groups/${group.id}`)
    }

    return (
        <div className="content-wrapper">
            <h2>Hey</h2>
            <span>BECOME AN ORGANIZER</span>
            <h4>We'll walk you through a few steps to build your local community</h4>
            <hr />
            <h4>First, set your group's location.</h4>
            <span>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online</span>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="city, STATE" value={cityState} onChange={(e) => setCityState(e.target.value)}/>
                <hr />
                <h4>What will your group's name be?</h4>
                <span>Choose a name that will give people a clear idea of what the group is about.</span>
                <span>Feel free to get creative! You can edit this later if you change your mind.</span>
                <input type="text" placeholder="What is your group name?" value={name} onChange={(e) => setName(e.target.value)}/>
                <hr />
                <h4>Now describe what your group will be about</h4>
                <span>People will see this when we promote your group, but you'll be able to add to it later, too.</span>
                <span>1. What's the purpose of the group?</span>
                <span>2. Who should join?</span>
                <span>3. What will you do at your events?</span>
                <textarea value={about} onChange={(e) => setAbout(e.target.value)}/>
                <hr />
                <h4>Final steps...</h4>
                <span>Is this an in person or online group?</span>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Online">Online</option>
                    <option value='In person'>In person</option>
                </select>
                <span>Is this group private or public?</span>
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
                <span>Please add an image url for your group below.</span>
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                <hr />
                <button type="submit">Create group</button>
            </form>

        </div>
    )
}