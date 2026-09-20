import React from 'react';
import Link from '@docusaurus/Link';
import styles from './FeatureGrid.module.css';
import {
  MarqueeIcon,
  PropsIcon,
  TemplatesIcon,
  PlaygroundsIcon,
  TricksIcon,
  GeniesIcon,
  ComposeIcon,
  SdkIcon,
  WalletIcon,
} from './FibeIcons';

const FEATURES = [
  {
    title: 'Marquees',
    blurb: 'Hosts for your Playgrounds. Bring your own or use a managed one.',
    href: '/concepts/marquees/',
    Icon: MarqueeIcon,
  },
  {
    title: 'Playspecs',
    blurb: 'Define an application once and launch it many times.',
    href: '/concepts/playspecs/#templates',
    Icon: TemplatesIcon,
  },
  {
    title: 'Playgrounds',
    blurb: 'A live, shareable, configurable application instance.',
    href: '/concepts/playgrounds/',
    Icon: PlaygroundsIcon,
  },
  {
    title: 'Props',
    blurb: 'Git repositories connected to Fibe.',
    href: '/concepts/props/',
    Icon: PropsIcon,
  },
  {
    title: 'Genies',
    blurb: 'AI assistants configured for your product and work.',
    href: '/concepts/agents/',
    Icon: GeniesIcon,
  },
  {
    title: 'Tricks',
    blurb: 'Scheduled, manual, and event-driven jobs.',
    href: '/concepts/tricks/',
    Icon: TricksIcon,
  },
  {
    title: 'Docker Compose to Fibe',
    blurb: 'Launch a Docker Compose application as a Fibe template.',
    href: '/authoring/compose-to-fibe/',
    Icon: ComposeIcon,
  },
  {
    title: 'Fibe SDK / CLI / MCP',
    blurb: 'Use Fibe from code, a terminal, or an AI agent.',
    href: '/sdk/intro/',
    Icon: SdkIcon,
  },
  {
    title: 'Mana & Sparks',
    blurb: 'Balances, daily costs, subscriptions, and referrals.',
    href: '/concepts/billing/',
    Icon: WalletIcon,
  },
];

export default function FeatureGrid() {
  return (
    <section id="key-concepts" className={styles.section}>
      <div className={styles.heading}>
        <h2>Key Concepts</h2>
      </div>
      <div className={styles.grid}>
        {FEATURES.map(({title, blurb, href, Icon}) => (
          <Link key={href} to={href} className={styles.card}>
            <span className={styles.iconBox} aria-hidden="true">
              <Icon />
            </span>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.blurb}>{blurb}</p>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
      <div className={styles.actions}>
        <Link className={`button button--primary button--lg ${styles.actionBtn}`} to="/intro/">
          Welcome
        </Link>
      </div>
    </section>
  );
}
