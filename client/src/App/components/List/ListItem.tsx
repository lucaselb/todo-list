import React from "react";
import styles from "./ListItem.module.scss";

interface Props {
  onRemove: VoidFunction;
  onEdit: VoidFunction;
}

const ListItem: React.FC<Props> = ({ children, onRemove, onEdit }) => {
  return (
    <li className={styles.container}>
      <span>{children}</span>
      <div>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onRemove}>Delete</button>
      </div>
    </li>
  );
};

export default ListItem;
