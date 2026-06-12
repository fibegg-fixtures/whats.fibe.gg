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
    blurb: 'Remote hosts where your playgrounds live. Bring your own or get managed.',
    href: '/concepts/marquees/',
    Icon: MarqueeIcon,
  },
  {
    title: 'Playspecs',
    blurb: 'Your application plan. Define it once, run many copies anytime.',
    href: '/concepts/playspecs/#templates',
    Icon: TemplatesIcon,
  },
  {
    title: 'Playgrounds',
    blurb: 'Live, shareable and configurable instance of your product.',
    href: '/concepts/playgrounds/',
    Icon: PlaygroundsIcon,
  },
  {
    title: 'Props',
    blurb: 'Your Git repositories, connected. First class citizen on Fibe.',
    href: '/concepts/props/',
    Icon: PropsIcon,
  },
  {
    title: 'Genies',
    blurb: 'AI assistant that actually knows your product.',
    href: '/concepts/agents/',
    Icon: GeniesIcon,
  },
  {
    title: 'Tricks',
    blurb: 'The only CI/CD that developers feel native.',
    href: '/concepts/tricks/',
    Icon: TricksIcon,
  },
  {
    title: 'docker-compose.yml → Fibe template',
    blurb: 'If something can be defined as a docker-compose.yml — it can be launched on Fibe.',
    href: '/authoring/compose-to-fibe/',
    Icon: ComposeIcon,
  },
  {
    title: 'Fibe SDK / CLI / MCP',
    blurb: 'Interfaces that match your style.',
    href: '/sdk/intro/',
    Icon: SdkIcon,
  },
  {
    title: 'Mana & Sparks',
    blurb: 'Honest and transparent billing.',
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
