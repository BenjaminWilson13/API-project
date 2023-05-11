import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignupFormModal from '../SignupFormModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';

import './Homepage.css';

function Homepage() {
    const sessionUser = useSelector(state => state.session.user);
    return (
        <div className='body-box'>
            <div className='outer-upper-box'>
                <div className='inner-upper-box'>
                    <h1>The people platform-Where interests become friendships</h1>
                    <p>This is some filler text that's designed to be particularly long so that it'll force some wrapping. Here's a little more text. I don't think this is quite long enough, so I'll have to make it a little longer. That should be about right, but we'll see.</p>
                </div>
                <div className='inner-upper-box'>
                    <img src='https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080' />
                </div>
            </div>
            <div className='inner-upper-box'>
                <h2>How Meetup works</h2>
                <p>This is some more text that's placeholder, but shorter this time.</p>
            </div>
            <div className='outer-lower-box'>
                <div className='inner-lower-box'>
                    <img src='https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384' />
                    <NavLink to='/groups'>See all groups</NavLink>
                    <span>This is the final lil bit of text. What will happen if I double the amount of text though?</span>
                </div>
                <div className='inner-lower-box'>
                    <img src='https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384' />
                    <NavLink to='/events'>Find an event</NavLink>
                    <span>This is also just a bit of text. What will happen if I double the amount of text though?</span>
                </div>
                <div className='inner-lower-box'>
                    <img src='https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384' />
                    {sessionUser ? <NavLink to='/groups/new'>Start a new group</NavLink> : <p>Start a new group</p>}
                    <span>This is a lil text down here. What will happen if I double the amount of text though?</span>
                </div>
            </div>
            {sessionUser ? null : (
                <OpenModalMenuItem
                itemText="Join Meetup"
                modalComponent={<SignupFormModal />}
              />
            )}
        </div>
    )
}

export default Homepage; 