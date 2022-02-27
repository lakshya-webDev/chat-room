import React, { useState, useEffect,Fragment } from "react"
import axios from 'axios';
import Logo from './assets/images/chat-logo.png';
import { useHistory , Link } from "react-router-dom";
import { ChatEngine } from 'react-chat-engine';
import { useAuth } from "../contexts/AuthContext"
import { auth } from "../firebase";
import { projectID, projectKey } from "../data/data";

const Chats = () =>{
// console.log(projectID,projectKey);
  const history = useHistory(); 
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);

  
  const getFile = async(url) =>{
      const response = await fetch(url);
      const data = await response.blob();
      return new File([data], "userPhoto.jpg", {type : 'image/jpeg'});
  }
  const handleLogout = async() =>{
    await auth.signOut();
    history.push('/');
}

  useEffect(()  => {
    
      if(!user){
          history.push('/');
          return;
      }
      axios.get('https://api.chatengine.io/users/me/',{
          headers :{
              "project-ID" : projectID,
              "user-name" : user.email,
              "user-secret" : user.uid
          }
      })
      .then((res) =>{
        console.log(res.data);
          setLoading(false);
      }).catch(() =>{
          let formdata = new FormData();
          formdata.append('email', user.email);
          formdata.append('username', user.email);
          formdata.append('secret', user.uid);
          getFile(user.photoURL)
          .then((avatar) =>{
              formdata.append('avatar', avatar, avatar.name);

              axios.post('https://api.chatengine.io/users/',
                          formdata,
                          {headers : {"private-key" : projectKey}}
              )
              .then((res)=>{console.log(res.data);setLoading(false)})
              .catch((error)=>console.log(error))
          })
      })
  },[user,history]);

  if(!user || loading) return <div/>;
  return (
    <Fragment>
      <nav className="navbar navbar-expand fixed-top" id="navbar_top">
      <div className="container">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link to="#" className="navbar-brand text-white"><img src={Logo} alt="logo"/></Link>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item profile-avtaar dropdown">
            <Link to="#"className="nav-link dropbtn text-white"><img src={user.photoURL} className="avtaar-img" alt="profile-img"/> {user.displayName}</Link>
                <div className="dropdown-content">
                  <Link to="#">{user.displayName}</Link>
                  <Link to="#" className="profile-email">{user.email}</Link>
                  <Link to="#" onClick={handleLogout}>Logout</Link>
                </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
      <div className='chats-page'> 
        <ChatEngine 
          height='calc(100vh - 66px)'
          projectID= {projectID}
          userName={user.email}
          userSecret={user.uid}
        />
      </div>
      </Fragment>
  );
}
export default Chats;