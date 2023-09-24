import React from "react";
import styles from "./progressBarr.module.css";

function ProgressBar({
  stop,
  target,
  now,
  symbol,
  targetAtPc,
  riskAtPc,
  meterInvalid,
  pru,
}) {
  const level = ((now - stop) / (target - stop)) * 100;
  const pruLevel = ((pru - stop) / (target - stop)) * 100;


  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <div className={styles.cursor} style={{ left: `${level}%` }}></div>
        <div className={styles.pru} style={{ left: `${pruLevel}%` }}></div>
      </div>

      <div className={styles.min}>
        stop {stop}
        {` `}
        {symbol}
        <br />
        {!meterInvalid ? <>{riskAtPc} %</> : <>&nbsp;</>}
      </div>

      <div className={styles.target}>
        cible {target}
        {` `}
        {symbol}
        <br />
        {!meterInvalid ? <>{targetAtPc} %</> : <>&nbsp;</>}
      </div>

      <div className={styles.now}>
        dernier {now}
        {` `}
        {symbol}
      </div>
    </div>
  );
}

export default ProgressBar;
