import ReactSpeedometer from "react-d3-speedometer";

function PerfMeter({ legend, min, max, perf, meterHeight, meterWidth }) {
  // calcul de la position de l'aiguille echelle de -500 -> +500 
  let value = 0;
  if (perf === 0) {
    value = 500;
  } else if (perf > 0) {
    value = (perf / max) * 500 + 500;
  } else if (perf < 0) {
    value = 500 - (perf / min) * 500;
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
        segmentValueFormatter={segmentValueFormatter}
      />
    </div>
  );
}

export default PerfMeter;
