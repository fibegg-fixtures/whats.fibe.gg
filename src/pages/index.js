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
        // Wait for dynamic layout/render to complete before scrolling
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'auto' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <Layout
      title="Fibe — user guide"
      description="Docker environments, AI Genies, and reusable templates. The full user guide for Fibe."
    >
      <Head>
        <link rel="canonical" href="https://whats.fibe.gg/" />
        <meta property="og:title" content="Fibe — user guide" />
        <meta property="og:description" content="Docker environments, AI Genies, and reusable templates." />
        <meta property="og:url" content="https://whats.fibe.gg/" />
      </Head>
      <Hero />
      <main>
        <FeatureGrid />
      </main>
    </Layout>
  );
}
