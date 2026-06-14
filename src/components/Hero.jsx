import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.title}>
          Fibe
        </h1>
        <p className={styles.lede}>
          Learn how Docker container orchestration combined with the right LLM harness unlocks new possibilities in software development <i>and beyond</i>
        </p>
        <div className={styles.ctas}>
          <a className={`button button--primary button--lg ${styles.cta}`} href="#key-concepts">
            See Key Concepts
          </a>
        </div>
      </div>
    </header>
  );
}
