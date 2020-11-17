import React, { useRef } from 'react';
import firebase from 'firebase';

function SignIn() {
    
    const emailRefSignUp = useRef('');
    const passwordRefSignUp = useRef('');
    const emailRefLogIn = useRef('');
    const passwordRefLogIn = useRef('');
    const confirmRef = useRef('');
    const userNameRef = useRef('');
    const emailRefReset = useRef('');

    const fireStore = firebase.firestore()

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then((result) => {
            fireStore.collection("users").doc(result.user.email).set({
                userName: result.user.displayName,
                email: result.user.email,
                createdAt: new Date()
            })
        }).catch(error => alert(error.message))
    };

    const signInWithGitHub = () => {
        const provider = new firebase.auth.GithubAuthProvider()
        firebase.auth().signInWithPopup(provider).then((result) => {
            fireStore.collection("users").doc(result.user.email).set({
                userName: result.user.displayName,
                email: result.user.email,
                createdAt: new Date()
            })
        }).catch(error => alert(error.message))
    };

    
    function onSubmitSignUp(e) {
        e.preventDefault()
        if (confirmRef.current.value === passwordRefSignUp.current.value) {
            firebase.auth().createUserWithEmailAndPassword(emailRefSignUp.current.value, passwordRefSignUp.current.value)
                .then(() => {
                        fireStore.collection("users").doc(emailRefSignUp.current.value).set({
                            userName: userNameRef.current.value,
                            email: emailRefSignUp.current.value,
                            createdAt: new Date()
                        })
                        .then(() => {
                            console.log("User successfully Signed up!");
                        })
                        .catch(error => {
                            console.log(error.message);
                        });
                    })
                    .catch(error => {
                        alert(error.message)
                    })
        } else {
            alert('passwords do not match')
        }
    } 
    
    function onSubmitLogIn(e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(emailRefLogIn.current.value, passwordRefLogIn.current.value)
            .catch(error => {
                alert(error.message)
            })
    }

    function resetPassword(e) {
        e.preventDefault()
        firebase.auth().sendPasswordResetEmail(emailRefReset.current.value)
            .then(() => alert(`Reset mail waiting for you in ${emailRefReset.current.value}`))
            .catch(error =>
                alert(error.message)
          );  
    }

  return (
    <div>
          <h1>Welcome to MTN maps game</h1>
          <h2>Sign up here:</h2>
          <form onSubmit={e => onSubmitSignUp(e)}>
              <div>User Name: <input ref={userNameRef} /></div>
              <div>Email: <input ref={emailRefSignUp}/></div>
              <div>Password: <input ref={passwordRefSignUp} /></div>
              <div>confirm Password: <input ref={confirmRef} /></div>
              <button type='submit'>Sign Up</button>
          </form>
          <h2>or</h2>
          <button onClick={signInWithGoogle}>Sign In With Google</button>
          <button onClick={signInWithGitHub}>Sign In With GitHub</button>
          <h2>Have an account already?</h2>
          <form onSubmit={e => onSubmitLogIn(e)}>
              <div>Email: <input ref={emailRefLogIn}/></div>
              <div>Password: <input ref={passwordRefLogIn} /></div> 
              <button type='submit'>Log in</button>
          </form>
          <h3>Forgot password? no problem</h3>
          Send reset mail to this account: <input ref={emailRefReset} />
          <button onClick={e => resetPassword(e)}>Send</button>
    </div>
  );
}

export default SignIn;