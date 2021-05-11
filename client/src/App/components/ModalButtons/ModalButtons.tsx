import React from "react";
import Button from "../Button";
import styles from "./ModalButtons.module.scss";

const ModalButtons: React.FC = ({ children }) => {
  return (
    <div className={styles.container}>{children}</div>
  );
};

export default ModalButtons;