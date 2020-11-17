import React, { useEffect, useState } from 'react';
import './App.css';
import Game from './game'
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import SignIn from './auth/signIn';
import SignUp from './auth/signUp';
import { firebaseConfig } from './secret';

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()

function App() {

  const [gamesHistory, setHistory] = useState([])
  const [user] = useAuthState(auth);  

  useEffect(() => {
    const fireStore = firebase.firestore()
    const gamesRef = fireStore.collection('games')
    const fetchGameHisory = (user) => {
      gamesRef.where("user", "==", user.displayName)
        .get()
        .then(res => {
          console.log(res)
          const resHistory = res.docs.map(doc => doc.data());
          setHistory(resHistory)
        })
        .catch(console.log('shit'));
    };
    if (user) fetchGameHisory(user)
  }, [user])

 
  return (
    <div>
      {user ? 
        <>
          {`Hello ${user.displayName}`}
          <button onClick={() => firebase.auth().signOut()}>log out</button>
          <Game user={user} firebase={firebase} />
          {gamesHistory.map(game => <div>{ game.score}</div>)}
        </>
        :
        <>
          <SignIn/>
          <SignUp />
        </>
      }
    </div>
  );
}

export default App;
