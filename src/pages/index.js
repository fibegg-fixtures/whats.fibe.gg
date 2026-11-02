import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Hero from '@site/src/components/Hero';
import FeatureGrid from '@site/src/components/FeatureGrid';

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'auto' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <Layout
      title="Fibe user guide"
      description="Self-hosted FIBE: Hosts, Specs, Repositories, Teams, Tasks, Agents, Library and long-running Playgrounds."
    >
      <Head>
        <link rel="canonical" href="https://whats.fibe.gg/" />
        <meta property="og:title" content="Fibe user guide" />
        <meta property="og:description" content="Self-hosted Playgrounds, Tasks, Agents and reusable Specs." />
        <meta property="og:url" content="https://whats.fibe.gg/" />
      </Head>
      <Hero />
      <main>
        <FeatureGrid />
      </main>
    </Layout>
  );
}
