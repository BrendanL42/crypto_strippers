import React from 'react'
import styles from "../../styles/ComingSoon.module.css";


const ComingSoon = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.loader}>
                <img
                  width={30}
                  height={30}
                  src={"/loading.svg"}
                  alt="loading"
                />
              </div>
            <h1>Our desktop application is still under development, check back soon.</h1>
        </div>
    )
}

export default ComingSoon;
