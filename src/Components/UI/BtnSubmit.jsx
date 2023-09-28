import styles from "./btn.module.css"

function BtnSubmit({value, name, style, disabled}) {
  return (
    <input
      className={`${styles.myBtn}`}
      type="submit"
      value={value}
      name={name}
      style={style}
      disabled={disabled}
    />
  );
}

export default BtnSubmit