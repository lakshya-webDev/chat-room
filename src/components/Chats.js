import React, { useRef, useState, useEffect } from "react"
import axios from 'axios';
import { useHistory ,Link } from "react-router-dom";
import { ChatEngine } from 'react-chat-engine';
import { useAuth } from "../contexts/AuthContext"
import { auth } from "../firebase";



export default function Chats() {
  const didMountRef = useRef(false);
  const [ loading, setLoading ] = useState(true);
  const { user } = useAuth();
  const history = useHistory();
  const REACT_APP_CHAT_ENGINE_ID ="fcf5ce20-08cb-4247-985b-95017934d11c";
  const REACT_APP_CHAT_ENGINE_KEY ="409df5d1-ab81-4ea1-9ed9-f02963589c2a";

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

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true

      if (!user || user === null) {
        history.push("/")
        return
      }
      
      // Get-or-Create should be in a Firebase Function
      axios.get(
        'https://api.chatengine.io/users/me/',
        { headers: { 
          "project-id":REACT_APP_CHAT_ENGINE_ID,
          "user-name": user.email,
          "user-secret": user.uid
        }}
      )

      .then(() => setLoading(false))

      .catch(e => {
        let formdata = new FormData()
        formdata.append('email', user.email)
        formdata.append('username', user.email)
        formdata.append('secret', user.uid)

        getFile(user.photoURL)
        .then(avatar => {
          formdata.append('avatar', avatar, avatar.name)

          axios.post('https://api.chatengine.io/users/',formdata,{
               headers: { 
                 "private-key":REACT_APP_CHAT_ENGINE_KEY 
                }
            }
          )
          .then(() => setLoading(false))
          .catch(e => console.log('e', e.response))
        })
      })

    }
  }, [user, history])
  
  if (!user || loading) return <div/>

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
                  <a className="nav-link dropbtn text-white"><img src={user.photoURL} className="avtaar-img"/> {user.displayName}</a>
                      <div className="dropdown-content">
                        <Link>{user.displayName}</Link>
                        <Link className="profile-email">{user.email}</Link>
                        <Link onClick={handleLogout}>Logout</Link>
                      </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
      <ChatEngine 
        height='calc(100vh - 66px)'
        projectID= {REACT_APP_CHAT_ENGINE_ID}
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  )
}