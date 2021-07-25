import './App.css';
import $ from 'jquery';
import React, { useEffect, useRef, useState } from 'react';
import Results from './components/Results';

export default function App (props) {
  let [isShown, setIsShown] = useState(false);
  let [isStarted, setIsStarted] = useState(false);
  let [isEnded, setIsEnded] = useState(false);
  let [numberOfDigits, setNumberOfDigits] = useState(4);
  let [numberOfRounds, setNumberOfRounds] = useState(20);
  let [numbersSet, setNumbersSet] = useState([]);
  let [resultSet, setResultSet] = useState([]);
  let [currentNumberIndex, setCurrentNumberIndex] = useState(null);
  let [difficultyLevel, setDifficultyLevel] = useState(1);
  let difficultyLevelTimings = [600, 400, 200];
  let inputRef = useRef(null);

  function keyDownHandler(e) {
    if (e.key === 'Enter') {
      let typedNumber = parseInt(e.target.innerText);
      if (typedNumber === numbersSet[currentNumberIndex]) {
        setResultSet([...resultSet, true]);
        $(inputRef.current).addClass('good');
      } else {
        setResultSet([...resultSet, false]);
        $(inputRef.current).addClass('wrong');
      }

      setTimeout(() => { $(inputRef.current).removeClass(['good', 'wrong']) }, 300);

      if (currentNumberIndex < numbersSet.length - 1) {
        setCurrentNumberIndex(currentNumberIndex + 1);
      } else {
        setIsStarted(false);
        setIsEnded(true);
      }
      
      e.preventDefault();
    }
  }

  useEffect(() => {
    if (isStarted) {
      setIsShown(true);
      setTimeout(() => { setIsShown(false) }, difficultyLevelTimings[difficultyLevel]);
    }
  }, [currentNumberIndex]);

  useEffect(() => {
    if (isStarted) {
      setResultSet([]);
      setIsEnded(false);
      setCurrentNumberIndex(0);
    }
  }, [isStarted]);

  useEffect(() => {
    if (isEnded) {
      setIsStarted(false);
    }
  }, [isEnded]);

  useEffect(() => {
    // if number is not shown, it's now time for user to type it
    if (!isShown && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isShown]);

  useEffect(() => {
    let numbers = [];
    for (let i = 0; i < numberOfRounds; i++) {
      let number = Math.floor(Math.random() * (Math.pow(10, numberOfDigits) - 
                   Math.pow(10, numberOfDigits - 1)) + Math.pow(10, numberOfDigits - 1));

      numbers.push(number);
    }
    setNumbersSet(numbers);
  }, [numberOfDigits, numberOfRounds]);

  return <div className="container-fluid">
    <div className="row mt-3">
      { !isStarted && 
      <div className="row align-items-center">
        <div className="col-12 col-md-3">
          <div className="form-floating">
            <input id="numberOfDigitsInput" type="number" min="3" className="form-control" placeholder="Number of digits (default: 4)"
              onChange={(e) => setNumberOfDigits(parseInt(e.target.value))} value={numberOfDigits} placeholder="..."/>
            <label htmlFor="numberOfDigitsInput">Number of digits (min: 3)</label>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-floating">
            <input id="numberOfRoundsInput" type="number" min="5" className="form-control" placeholder="Number of rounds (default: 20)"
              onChange={(e) => setNumberOfRounds(parseInt(e.target.value))} value={numberOfRounds} placeholder="..."/>
            <label htmlFor="numberOfRoundsInput">Number of rounds (min: 5)</label>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-floating">
            <select id="" className="form-select" 
                    onChange={(e) => setDifficultyLevel(e.target.value)} defaultValue={difficultyLevel}>
              <option value="0">Low</option>
              <option value="1">Medium</option>
              <option value="2">Hard</option>
            </select>
            <label htmlFor="numberOfRoundsInput">Difficulty level</label>
          </div>
        </div>
      </div>
      }
      <div className="col-12 col-md-4 position-absolute top-50 start-50 translate-middle">
        { isStarted &&
          <>
            <span>{currentNumberIndex + 1}/{numbersSet.length}</span>
            <div className="inputDiv text-center display-4"
                suppressContentEditableWarning ref={inputRef} contentEditable={!isShown} onKeyDown={(e) => keyDownHandler(e)}>
              {isShown && numbersSet[currentNumberIndex]}
            </div>
            <a className="btn btn-outline-secondary btn-xs mt-1 d-inline-block" style={{float: 'right'}}
               onClick={() => setIsEnded(true)}>End</a>
          </>
        }
        {
          !isStarted && <div className="text-center"><button className="btn btn-success btn-lg"
                        onClick={() => setIsStarted(true)}>Start</button></div>
        }
        {
          isEnded && <Results results={resultSet} />
        }
      </div>
    </div>
  </div>
}