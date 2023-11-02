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
  neutral,
  position,
  tradeQuote,
  status,
  pru,
}) {



  let level = null;
  let color = "black";
  if (status === "OnStop") {
    level = 0;
    color = "red";
  } else if (status === "OnTarget") {
    level = 100;
    color = "green";
  } else {
    level = ((now - stop) / (target - stop)) * 100;
  }

  const neutralLevel = ((neutral - stop) / (target - stop)) * 100;

  let neutralVisible = neutral < stop || neutral > target ? "none" : "block";

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <div
          className={styles.cursor}
          style={{ left: `${level}%`, backgroundColor: `${color}` }}
        ></div>
        <div
          className={styles.neutral}
          style={{ left: `${neutralLevel}%`, display: `${neutralVisible}` }}
        ></div>
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
        <br />
        {pru ? (
          <>
            {`   `}
            pru {pru}
            {` `}
            {symbol}
          </>
        ) : (
          <>&nbsp;</>
        )}
      </div>
    </div>
  );
}

export default ProgressBar;
