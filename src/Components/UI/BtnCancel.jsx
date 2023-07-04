import styles from "./btn.module.css";

function BtnCancel({ value, action }) {
  return <input className={`${styles.myBtn} ${styles.cancel}`} type="button" value={value} onClick={action}/>;
}

export default BtnCancel;
