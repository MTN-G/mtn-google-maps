import React from 'react';
import './App.css';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Game from './game';
import SignIn from './auth/signIn';
import { firebaseConfig } from './secret';

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div>
      {user
        ? (
          <>
            {`Hello ${user.displayName}`}
            <button onClick={() => firebase.auth().signOut()}>log out</button>
            <Game user={user} firebase={firebase} />
          </>
        )
        : (
          <>
            <SignIn />
          </>
        )}
    </div>
  );
}

export default App;
