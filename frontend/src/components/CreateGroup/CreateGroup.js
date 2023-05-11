import React, { useEffect, useState } from "react"
import './CreateGroup.css'
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom";
import { postCreateGroup, putEditGroup } from "../../store/allGroups";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { fetchGroups } from "../../store/allGroups";
import { fetchSpecificGroup } from "../../store/allGroups";

export default function CreateGroup({ formType }) {

    const history = useHistory();
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.singleGroup);
    useEffect(() => {
        dispatch(fetchSpecificGroup(groupId));
    }, [])
    const [cityState, setCityState] = useState(formType === 'Edit'? group?.city.trim() + ', ' + group.state.trim() : '');
    const [name, setName] = useState(formType === 'Edit' ? group?.name : '');
    const [about, setAbout] = useState(formType === 'Edit' ? group?.about : '');
    const [type, setType] = useState(formType === 'Edit' ? group?.type : undefined);
    const [privacy, setPrivacy] = useState(formType === 'Edit' ? group.private : undefined);
    const [url, setUrl] = useState(formType === 'Edit' ? group?.GroupImages[0].url : '');
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        const error = {};
        if (!cityState || cityState.length < 4 || !cityState.includes(',')) {
            error.cityState = 'Location is required';
        }
        if (!name || name.length < 1 || name.length > 60) {
            error.name = 'Name is required';
        }
        if (!about || about.length < 30) {
            error.about = 'Description must be at least 30 characters long';
        }
        if (type === undefined) {
            error.type = 'Group Type is required';
        }
        if (privacy === undefined) {
            error.privacy = 'Visibility Type is required';
        }
        const splitUrl = url.split('.');
        if (!url || !splitUrl[splitUrl.length - 1] == 'png' && !splitUrl[splitUrl.length - 1] == 'jpg' && !splitUrl[splitUrl.length - 1] == 'jpeg') {
            error.url = 'Image URL must end in .png, .jpg, or .jpeg'
        }
        setErrors(error)
        if (Object.keys(error).length === 0) {

            const city = cityState.split(',')[0];
            const state = cityState.split(',')[1];

            if (formType !== 'Edit') {
                let group = await dispatch(postCreateGroup({
                    name,
                    about,
                    type,
                    privacy,
                    city,
                    state,
                    url
                }))
            } else if (formType === 'Edit') {
                let group = await dispatch(putEditGroup({
                    name, 
                    about, 
                    type, 
                    privacy, 
                    city, 
                    state, 
                    url, 
                    groupId
                }))
            }
            history.push(`/groups/${group.id}`)
        } else {
            setSubmitted(false);
            // setErrors({});
        }
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
                <input type="text" placeholder="city, STATE" value={cityState} onChange={(e) => setCityState(e.target.value)} />
                {errors.cityState ? <span>{errors.cityState}</span> : null}
                <hr />
                <h4>What will your group's name be?</h4>
                <span>Choose a name that will give people a clear idea of what the group is about.</span>
                <span>Feel free to get creative! You can edit this later if you change your mind.</span>
                <input type="text" placeholder="What is your group name?" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name ? <span>{errors.name}</span> : null}
                <hr />
                <h4>Now describe what your group will be about</h4>
                <span>People will see this when we promote your group, but you'll be able to add to it later, too.</span>
                <span>1. What's the purpose of the group?</span>
                <span>2. Who should join?</span>
                <span>3. What will you do at your events?</span>
                <textarea value={about} placeholder="Please write at least 30 characters" onChange={(e) => setAbout(e.target.value)} />
                {errors.about ? <span>{errors.about}</span> : null}
                <hr />
                <h4>Final steps...</h4>
                <span>Is this an in person or online group?</span>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value={undefined}>(select one)</option>
                    <option value="Online">Online</option>
                    <option value='In person'>In person</option>
                </select>
                {errors.type ? <span>{errors.type}</span> : null}
                <span>Is this group private or public?</span>
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                    <option value={undefined}>(select one)</option>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
                {errors.privacy ? <span>{errors.privacy}</span> : null}
                {formType !== 'Edit' ? <span>Please add an image url for your group below.</span> : null} 
                {formType !== 'Edit' ? <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} /> : null}
                <hr />
                <button type="submit">{formType === 'Edit' ? 'Update group' : 'Create group'}</button>
            </form>

        </div>
    )
}