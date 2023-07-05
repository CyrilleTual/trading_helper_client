import styles from "./btn.module.css";

function BtnAction({ value, action }) {
   return (
     <input
       className={`${styles.myBtn}`}
       type="button"
       value={value}
       onClick={action}
     />
   );
}

export default BtnAction;


 