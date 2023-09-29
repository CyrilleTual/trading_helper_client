import styles from "./btn.module.css";

function BtnAction({ value, action, name, style }) {
   
   return (
     <input
       className={`${styles.myBtn}`}
       type="button"
       value={value}
       onClick={action}
       name={name}
     />
   );
}

export default BtnAction;


 