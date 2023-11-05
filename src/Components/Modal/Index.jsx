import { useState } from "react";
import styles from "./modal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


// on passe en props le contenu du modal et une action à faire sur fermeture


  // // après log et fonction passée au modal
  // const afterModal = () => {
  //   navigate("/global");
  // };

//<Modal
  //display={
    //<p>
      //ICI VOTRE TEXTE
    //</p>
  //}
 //action={afterModal}
///>; 


export default function Modal({ display, action = () => {} }) {
  
  const [modal, setModal] = useState(true);

  const toggleModal = () => {
    document.body.classList.remove`blockedY`;
    setModal(!modal);
    action();
  };

  if (modal) {
    document.body.classList.add`blockedY`;
  } else {
    document.body.classList.remove`blockedY`;
  }

  return (
    <>
      {modal && (
        <div className={styles.modal} onClick={toggleModal}>
          <div className={styles.content}>
            {display}
            <button className={styles.btn_close} onClick={toggleModal}>
              <FontAwesomeIcon icon={faXmark} size={"xl"} color={"red"} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
