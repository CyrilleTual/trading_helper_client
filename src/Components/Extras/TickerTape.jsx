import React, { useEffect, useRef } from "react";

function TickerTape() {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          {
            "proName": "FOREXCOM:SPXUSD",
            "title": "S&P 500"
          },
          {
            "proName": "FOREXCOM:NSXUSD",
            "title": "US 100"
          },
          {
            "proName": "FX_IDC:EURUSD",
            "title": "EUR/USD"
          },
          {
            "proName": "BITSTAMP:BTCUSD",
            "title": "Bitcoin"
          },
          {
            "proName": "BITSTAMP:ETHUSD",
            "title": "Ethereum"
          }
        ],
        "showSymbolLogo": true,
        "colorTheme": "light",
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": "fr"
      }`;
    container.current.appendChild(script);
  }, []);

  return (
    
      <aside className="tradingview-widget-container tape" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright">
          {/* <a
            href="https://fr.tradingview.com/"
            rel="noopener nofollow"
            target="_blank"
          >
            <span class="blue-text">
              Suivre tous les marchés sur TradingView
            </span>
          </a> */}
        </div>
      </aside>
    
  );
}

export default TickerTape;
