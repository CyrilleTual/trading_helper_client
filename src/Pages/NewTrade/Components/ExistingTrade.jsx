import React from 'react'
import BtnLink from '../../../Components/UI/BtnLink';

function ExistingTrade() {
  return (
    <>
      <h2>Trade Existant</h2>
      <p>
        {" "}
        Un trade est défini par un instrument (action, etf ...) et un
        portefeille
      </p>
      <p>
        {" "}
        Vous ne pouvez pas ouvrir plusieurs trade sur le même actif dans un même
        portefeille.{" "}
      </p>
      <p>
        Par contre vous pouvez renforcer votre position : A partir du détail
        d'un portefeuille : re-enter !
      </p>
      <div>
        <BtnLink link="/global" title="Acceuil" name="global" />
      </div>
    </>
  );
}

export default ExistingTrade