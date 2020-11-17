import React from 'react';
import firebase from 'firebase';

function SignIn () {

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider)
    };

  return (
    <div>
          <h1>Welcome to MTN maps game</h1>
          <button onClick={signInWithGoogle}>Sign In</button>
    </div>
  );
}

export default SignIn;