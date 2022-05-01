import React, { Fragment } from "react";
import styles from "../styles/Navbar.module.css";
import avatar from "../static/avatar.png";

function Navbar() {
  return (
    <Fragment>
      <div className={styles.navbar_main}>
        <h1> Edvora </h1>
        <span className={styles.user_avatar}>
          <h3> Dhruv Singh </h3>
          <img src={avatar} alt="avatar" />
        </span>
      </div>
    </Fragment>
  );
}

export default Navbar;
