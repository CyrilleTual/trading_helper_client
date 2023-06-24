import ReactSpeedometer from "react-d3-speedometer";

 

function PerfMeter({ min, max, perf}) {


    let value = 666;

    function segmentValueFormatter(value) {
      if (value < 200) {
        return `-125`;
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
      return `+1254`;
    }



  return (
    <ReactSpeedometer
      value={value}
      currentValueText="Performance globale"
      needleColor="black"
      needleTransitionDuration={3000}
      needleTransition="easeElastic"
      ringWidth={50}
      needleHeightRatio={0.7}
      segments={5}
      segmentValueFormatter={segmentValueFormatter}
     // segmentColors={["#bf616a", "#d08770", "#ebcb8b", "#a3be8c", "#b48ead"]}
    //   customSegmentLabels={[
    //     {
    //       text: "perte",
    //       position: "INSIDE",
    //       color: "#555",
    //     },
    //     {
    //       text: "",
    //       position: "INSIDE",
    //       color: "#555",
    //     },
    //     {
    //       text: "neutre",
    //       position: "INSIDE",
    //       color: "#555",
    //       fontSize: "19px",
    //     },
    //     {
    //       text: "",
    //       position: "INSIDE",
    //       color: "#555",
    //     },
    //     {
    //       text: "profit",
    //       position: "INSIDE",
    //       color: "#555",
    //     },
    //   ]}
    />
  );}

export default PerfMeter