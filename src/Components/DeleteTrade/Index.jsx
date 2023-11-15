import React from "react";
import BtnCancel from "../UI/BtnCancel";
import BtnAction from "../UI/BtnAction";
import { useDeleteTradeMutation } from "../../store/slice/tradeApi";
import styles from "./deleteTrade.module.css";

function DeleteTrade({ trade, afterModal2 }) {
  const [delTrade] = useDeleteTradeMutation();

  const deleteTrade = () => {
    delTrade(trade.tradeId);
  };

  return (
    <div>
      <p>
        Attention vous êtes sous le point de supprimer DEFINITIVEMENT le trade
        n°{trade.uid} sur {trade.title} et tous les événements qui s'y
        rapportent. <br/>
        Cette opération est irréversible.
        <div className={styles.buttonsContainer}>
          <BtnCancel
            value={"finalement non..."}
            action={afterModal2}
            name={"cancel"}
          />
          <BtnAction
            value={"suppression du trade "}
            action={deleteTrade}
            name={"Suppression"}
          />
        </div>
      </p>
    </div>
  );
}

export default DeleteTrade;
