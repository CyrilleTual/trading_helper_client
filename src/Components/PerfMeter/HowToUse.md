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
 // variable pour invalider la jauge 
  const [meterInvalid, setMeterInvalid] = useState(false);
  useEffect(() => {
    newMetrics.valid === false ? setMeterInvalid(true) : setMeterInvalid(false);
  }, [newMetrics]);
```

## Dans le jsx
// Exemple d'utilisation :

``
 {/* --------------------------------- début perfMeter --------------- */}
            <div className={` ${styleMeter.wrapper_meter}`}>
              <div className={`${styleMeter.alertInvalid} ${
                    meterInvalid ? styleMeter.alertVisible : ""
                  } `}>
                <div
                  className={`${styleMeter.alertInvalid_content} `}
                >
                  {" "}
                  Stop ou TP invalide{" "}
                </div>
              </div>

              <div
                className={`${styleMeter.meter_container} ${
                  meterInvalid ? styleMeter.opacify : ""
                }`}
              >
                <PerfMeter
                  legend={
                    metrics.balance > 0
                      ? `Gain actuel : ${metrics.balance} ${currencySymbol} `
                      : `Perte actuelle : ${metrics.balance} ${currencySymbol} `
                  }
                  min={newMetrics.valid ? newMetrics.risk : metrics.risk}
                  max={
                    newMetrics.valid ? newMetrics.potential : metrics.potential
                  }
                  perf={metrics.balance}
                  meterWidth={styleMeter.meterWidth}
                  meterHeight={styleMeter.meterHeight}
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



```# In the module Where you want to use the perfMeter:

## imports

```javascript
import PerfMeter from "../../Components/PerfMeter/Index";
import styleMeter from "../../Components/PerfMeter/perfMeter.module.css";
```


