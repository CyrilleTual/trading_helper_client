import styles from "./loading.module.css";

export function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}></div>
      <div className={styles.loader2}></div>
    </div>
  );
}
