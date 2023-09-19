import ReactSpeedometer from "react-d3-speedometer";

function PerfMeter({ legend, min, max, perf, meterHeight, meterWidth }) {

let colors = ["#ff471A", "#F6961E", "#ECDB23", "#AEE228", "#6AD72D"];
  // calcul de la position de l'aiguille echelle de -500 -> +500 
  let value = 0;
  

  if ( max>0 && min<0) {
      if (perf === 0) {
    value = 500;
  } else if (perf > 0) {
    value = (perf / max) * 500 + 500;
  } else if (perf < 0) {
    value = 500 - (perf / min) * 500;
  }
  } else if (max > 0 && min > 0) {
    value = ((perf - min) / (max - min)) * 1000;
    colors = ["#AAFFA9", "#58FF57", "#06FE07", "#00BA01", "#006A00"];
  } else if (max < 0 && min < 0) {
    value = ((perf - min) / (max - min)) * 1000;
    colors = ["#AF0000", "#FF0707", "#FF5757", "#FFA9A8", "#FEC0C1"];
  }



  function segmentValueFormatter(value) {
    if (value < 200) {
      return `${min}`;
    }
    if (value < 400) {
      return `😐`;
    }
    if (value < 600) {
      return `😌`;
    }
    if (value < 800) {
      return `😊`;
    }
    if (value < 900) {
      return `😉`;
    }
    return `${max}`;
  }

  /// style inline indispensable, gestion par le module
  // doit être conforme au container pour centrage
  return (
    <div
      style={{
        width: `${meterWidth}`,
        height: `${meterHeight}`,
      }}
    >
      <ReactSpeedometer
        fluidWidth={true}
        value={value}
        currentValueText={legend}
        needleColor="black"
        needleTransitionDuration={3000}
        needleTransition="easeElastic"
        ringWidth={50}
        needleHeightRatio={0.7}
        segments={5}
        segmentColors={colors}
        segmentValueFormatter={segmentValueFormatter}
        forceRender={true}
      />
    </div>
  );
}

export default PerfMeter;
