import React, { useState, useMemo } from 'react';
import './App.css';
import Map from './map'
const placesFromJson = require('./csvjson')
const places = placesFromJson.filter(place => place['MGLSDE_L_4']);

function Game({user, firebase}) {
    
    const [step, setStep] = useState() 
    const [clientClick, setClientClick] = useState({})
    const [showMarker, setShowMarker] = useState()
    const [chosen, setChosen] = useState()
    const [points, setPoints] = useState(0);
    const [gameOver, setGameOver] = useState(true);
    const position = useMemo(() => {
        if (step)
        return (
            { lat: chosen['Y'], lng: chosen['X'] }
            )
        }, [chosen, step]);

    const fireStore = firebase.firestore()
    const gamesRef = fireStore.collection('games')
    console.log(gamesRef)
    const saveToFireStore = () => {
        gamesRef.add({
        user: user.displayName,
        score: points
        }).then(res => console.log(res)).catch(error => console.log(error))
    }


  const startGame = () => {
    setGameOver(false)
    setStep(1)
    setPoints(0)
    setClientClick({})
    setChosen(places[Math.floor(Math.random() * 1240)]); 
    setShowMarker(false)
  }

  const handleClick = function (e) {
    if (!gameOver && !showMarker) {
      setShowMarker(true)
      setClientClick({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      })
    
      const distance = getDistance(position.lat, position.lng, e.latLng.lat(), e.latLng.lng())
      calcPoints(distance);
    }
    if (step === 2) {
        saveToFireStore()
        setGameOver(true)
    }
   } 
  
  const handleNext = function () {
    setChosen(places[Math.floor(Math.random() * 1240)]); 
    setStep(step + 1)
    setShowMarker(false)
    setClientClick({})
  }


  function getDistance(lat1,lon1,lat2,lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1); 
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; 
    console.log(d);// Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  function calcPoints (distance) {
    let points;
     if (distance < 2) {
       points = 750
     }
     else if (distance < 7) {
       points = 500 
     }
     else if (distance < 15) {
       points = 400
     }
     else if (distance < 23) {
       points = 300
     }
     else if (distance < 32) {
       points = 200
     }
     else if (distance < 50) {
       points = 100
     }
     else points = 0
      
      console.log(points)
    setPoints(prev => prev + points)
  }

  

  return (
    <div className="App">
      <Map
        className="map"
        markerPosition={position} 
        showMarker={showMarker}
        clientClick={clientClick} 
        handleClick={handleClick}
      />
      <div>
        {!gameOver && <div>find: {chosen['MGLSDE_L_4']}</div>}
        {gameOver && <button onClick={startGame}>Start New Game</button>}
        {step && <div>score: {points}</div>}
        {step && <div>{gameOver? `game over` : `step: ${step} / 8`}</div>}
        {showMarker && !gameOver && <button onClick={handleNext}>Next</button>}
      </div>
    </div>
  );
}

export default Game;