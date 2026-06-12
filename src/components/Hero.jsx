import React from 'react';
import Link from '@docusaurus/Link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.title}>
          Fibe
        </h1>
        <p className={styles.lede}>
          Learn how docker containers orchestration mixed with the right LLM harness unlocks unlimited possibilities in software development <i>and outside</i>
        </p>
        <div className={styles.ctas}>
          <Link className={`button button--primary button--lg ${styles.cta}`} to="#key-concepts">
            See Key Concepts
          </Link>
        </div>
      </div>
    </header>
  );
}
