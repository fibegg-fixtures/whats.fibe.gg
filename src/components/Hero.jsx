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
          Run long-running Playgrounds on your Hosts, automate Tasks, and work with Agents in your self-hosted FIBE installation.
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
