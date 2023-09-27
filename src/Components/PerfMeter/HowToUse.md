# Setting up PerfMeter in Your Module

## imports

```javascript
import PerfMeter from "../../Components/PerfMeter/Index";
import styleMeter from "../../Components/PerfMeter/perfMeter.module.css";
```


## in the core of the module 

-> set a variable to hide the perfMeter if the values are not in a correct range:
the name of 'meterInvalid' need to be respected.

```javascript
  // appel de la fonction qui retourne des variables utiles pour masquer le meter.
  const {meterInvalid, situation } = utilsMeter(trade);
```
->  OR if needed 

```
    // appel de la fonction qui retourne des variables utiles pour masquer le meter.
  const [meterInvalid, setMeterInvalid] = useState(null);
  const [situation, setSituation] = useState(null);
  useEffect(() => {
    let result = null;
    if (trade) {
      const { meterInvalid, situation } = utilsMeter(trade);
      setMeterInvalid(meterInvalid);
      setSituation(situation);
    }
  }, [trade]);

```

## Dans le jsx
// Exemple of Use ( with masking)

``
{/* --------------------------------- début perfMeter --------------- */}
<div className={` ${styleMeter.wrapper_meter}`}>
  <div
    className={`${styleMeter.alertInvalid} ${
      meterInvalid ? styleMeter.alertVisible : ""
    } `}
  >
    <div className={`${styleMeter.alertInvalid_content} `}>
      {situation}
    </div>
  </div>

  <div
    className={`${styleMeter.meter_container} ${
      meterInvalid ? styleMeter.opacify : ""
    }`}
  >
    <PerfMeter
      legend={
          trade.balance > 0
          ? `Gain : ${ trade.balance} ${trade.symbol} /  ${ trade.balancePc.toFixed(
              2
            )} %. `
          : `Perte : ${ trade.balance} ${
              trade.symbol
            } /  ${ trade.balancePc.toFixed(2)} %. `
      }
      min={ trade. risk}
      max={ trade.potential}
      perf={ trade.balance}
      meterWidth={styles.meterWidth}
      meterHeight={styles.meterHeight}
    />
  </div>
</div>
{/* --------------------------------fin perfMeter --------------- */}
``


## in the CSS file of the module you have to set 
```css
/* Attention pour les dimensions du meter indispensable de passer
par des variables ( et de les setter 2* -> pour la div container et 
Pour le svg) */
.adjust {
  --metW: 80vw;
  --metH: calc((var(--metW)) * 0.58);
}
@media screen and (min-width: 480px) {
  .adjust {
    --metW: 400px;
    --metH: 230px;
  }
}
:export {
  meterWidth: var(--metW);
  meterHeight: var(--metH);
}

 


