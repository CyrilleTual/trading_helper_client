import styles from "./btn.module.css";

function BtnCancel({ value, action, name }) {
  return <input className={`${styles.myBtn} ${styles.cancel}`} type="button" value={value} onClick={action} name={name}/>;
}

export default BtnCancel;
