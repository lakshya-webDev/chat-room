import React from "react"
import firebase from "firebase/app"
import { auth } from "../firebase"
import GoogleIcon from './assets/images/icon-google.png';
import FacebokIcon from './assets/images/facebook.png';
export default function Login() {
  return (
    <div className="limiter">
        <div className="container-login100">
            <div className="wrap-login100 p-l-50 p-r-50 p-t-77 p-b-30">
              <form className="login100-form validate-form">
                  <span className="login100-form-title p-b-55">
                  Login To Chatting Zone
                  </span>
                  <a href="#" className="btn-face m-b-10" onClick={() => auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider())}>
                  <img src={FacebokIcon} alt="Facebook" height={20} width={20} className="img-fluid me-2" />
                  Facebook
                  </a>
                  <a href="#" className="btn-google m-b-10" onClick={() => auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())}>
                  <img src={GoogleIcon} alt="GOOGLE" className="img-fluid me-2"/>
                  Google
                  </a>
              </form>
            </div>
        </div>
      </div>
  )
}