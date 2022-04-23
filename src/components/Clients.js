import React from 'react';
import Avatar from 'react-avatar';


const Clients = ({username}) => {
    // console.log('username',username);
  return (
    <div className='client'>
        <Avatar name={username} size={50} round="14px"/>
        <span className='"username'>{username}</span>
        
        </div>
  )
}

export default Clients;