import styles from "./btn.module.css"

function BtnSubmit({value}) {
  return <input className={`${styles.myBtn}`} type="submit" value={value} />;
}

export default BtnSubmit