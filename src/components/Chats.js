import React, { useRef, useState, useEffect } from "react"
import axios from 'axios';
import { useHistory , Link } from "react-router-dom";
import { ChatEngine } from 'react-chat-engine';
import { useAuth } from "../contexts/AuthContext"
import { auth } from "../firebase";

export default function Chats() {
  const didMountRef = useRef(false);
  const [ loading, setLoading ] = useState(true);
  const { user } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    await auth.signOut()
    history.push("/")
  }

  async function getFile(url) {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], "test.jpg", { type: 'image/jpeg' });

  // console.log(response,'response',data,'data')
  }
  // const goProfilePage = () => {
  //   history.push("/profile");
  // };

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true

      if (!user || user === null) {
        history.push("/")
        return
      }
      // Get-or-Create should be in a Firebase Function
      axios.get(
        'https://api.chatengine.io/users/me/',{ 
          headers: { 
          "project-ID":process.env.REACT_APP_CHAT_ENGINE_ID,
          "user-name": user.email,
          "user-secret": user.uid
        },
      })
      .then(() => setLoading(false))
      .catch(() =>{
        let formdata = new FormData();
        formdata.append('email', user.email);
        formdata.append('username', user.email);
        formdata.append('secret', user.uid);
        getFile(user.photoURL).then(avatar => {
          formdata.append('avatar', avatar, avatar.name);
          axios.post('https://api.chatengine.io/users/',formdata,{
               headers: {"private-key":process.env.REACT_APP_CHAT_ENGINE_KEY}})
          .then(() => setLoading(false))
          .catch((error)=>console.log(error))
        });
      });

    }
  }, [user, history]);
  
  if (!user || loading) return <div/>;
  return (
    <div className='chats-page'>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <Link to="#" className="navbar-brand text-white">Chat Room</Link>
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
      <ChatEngine 
        height='calc(100vh - 66px)'
        projectID= {process.env.REACT_APP_CHAT_ENGINE_ID}
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  );
}