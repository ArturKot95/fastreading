import React from 'react';
import './Results.css';

export default function Results (props) {
  let resultElements = props.results.map(result => (
    <div className={`result ${result === true ? 'result-good' : 'result-wrong'}`}></div>
  ));

  return <div className="text-center mt-5">
    { resultElements }
  </div>
}