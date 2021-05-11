import React from 'react';
import styles from "./Input.module.scss";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
    return (
        <input className={styles.container} {...props} type="text"></input>
    );
};

export default Input;