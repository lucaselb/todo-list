import React from "react";
import styles from "./List.module.scss";

const List: React.FC = ({ children }) => {
  return <ul className={styles.container}>{children}</ul>;
};

export default List;
