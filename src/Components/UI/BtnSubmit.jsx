import styles from "./btn.module.css"

function BtnSubmit({value, name}) {
  return <input className={`${styles.myBtn}`} type="submit" value={value} name={name}/>;
}

export default BtnSubmit