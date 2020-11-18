/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */
import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import Map from './map';
import { getDistance } from './helpers';

const placesFromJson = require('./csvjson');

const places = placesFromJson.filter((place) => place.MGLSDE_L_4);

function Game({ user, firebase }) {
  const [step, setStep] = useState();
  const [clientClick, setClientClick] = useState({});
  const [showMarker, setShowMarker] = useState();
  const [chosen, setChosen] = useState();
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [gamesHistory, setHistory] = useState([]);
  const position = useMemo(() => {
    if (step) {
      return (
        { lat: chosen.Y, lng: chosen.X }
      );
    }
  }, [chosen, step]);

  useEffect(() => {
    const fireStore = firebase.firestore();
    const gamesRef = fireStore.collection('games');
    const fetchGameHisory = (logedUser) => {
      gamesRef.where('user', '==', logedUser.displayName)
        .get()
        .then((res) => {
          console.log(res);
          const resHistory = res.docs.map((doc) => doc.data());
          const sortResHistory = resHistory.sort((a, b) => b.date.seconds - a.date.seconds)
          setHistory(sortResHistory);
        })
        .catch((error) => console.log(error.message));
    };
    fetchGameHisory(user);
  }, [gameOver]);


  const fireStore = firebase.firestore();
  const gamesRef = fireStore.collection('games');

  const saveToFireStore = () => {
    gamesRef.add({
      user: user.displayName,
      score: points,
      date: new Date()
    }).then((res) => console.log(res)).catch((error) => console.log(error));
  };

  const startGame = () => {
    setGameOver(false);
    setStep(1);
    setPoints(0);
    setClientClick({});
    setChosen(places[Math.floor(Math.random() * 1240)]);
    setShowMarker(false);
  };

  const handleClick = function (e) {
    if (!gameOver && !showMarker) {
      setShowMarker(true);
      setClientClick({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });

      const distance = getDistance(position.lat, position.lng, e.latLng.lat(), e.latLng.lng());
      calcPoints(distance);
    }
    if (step === 2) {
      saveToFireStore();
      setGameOver(true);
    }
  };

  const handleNext = function () {
    setChosen(places[Math.floor(Math.random() * 1240)]);
    setStep(step + 1);
    setShowMarker(false);
    setClientClick({});
  };

  function calcPoints(distance) {
    let points;
    if (distance < 2) {
      points = 750;
    } else if (distance < 7) {
      points = 500;
    } else if (distance < 15) {
      points = 400;
    } else if (distance < 23) {
      points = 300;
    } else if (distance < 32) {
      points = 200;
    } else if (distance < 50) {
      points = 100;
    } else points = 0;
    setPoints((prev) => prev + points);
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
        {!gameOver && (
          <div>
            find:
            {chosen.MGLSDE_L_4}
          </div>
        )}
        {gameOver && <button onClick={startGame}>Start New Game</button>}
        {step && (
          <div>
            score:
            {points}
          </div>
        )}
        {step && <div>{gameOver ? 'game over' : `step: ${step} / 8`}</div>}
        {showMarker && !gameOver && <button onClick={handleNext}>Next</button>}
      </div>
      <div>
      Your games history:
      <table style={{ border: '1px solid black' }}>
        <thead >
                <th>Date</th>
                <th>Score</th>
              </thead>
              <tbody>
                {gamesHistory.map((game, i) =>
                  <tr key={i}>
                    <td>{game.date.toDate().toLocaleString()}</td>
                    <td>{game.score}</td>
                  </tr>
                )}
              </tbody>
        </table>
      </div>
    </div>
  );
}

export default Game;
