import { Spinner } from "react-bootstrap";
import styles from "./Loader.module.css";

function Loader() {
  return (
    <div className={styles.container}>
      <Spinner animation="border" role="status" className={styles.spinner}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default Loader;
