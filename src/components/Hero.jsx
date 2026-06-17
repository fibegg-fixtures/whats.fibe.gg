import React from 'react';
import styles from './Hero.module.css';
import OrchestrationMesh from './OrchestrationMesh';

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
        <OrchestrationMesh />
        <div className={styles.ctas}>
          <a className={`button button--primary button--lg ${styles.cta}`} href="#key-concepts">
            See Key Concepts
          </a>
          <a className={`button button--secondary button--lg ${styles.cta}`} href="/intro/">
            Read the guide
          </a>
        </div>
      </div>
    </header>
  );
}
