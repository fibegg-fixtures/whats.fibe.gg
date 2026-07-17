// @ts-check
// Docusaurus config for whats.fibe.gg — the Fibe user guide and skills library.
// Mirrors conventions of the docs project at docs.fibe.gg.

import {themes as prismThemes} from 'prism-react-renderer';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Fibe — user guide & skills',
  tagline: 'Docker environments, AI Genies, and reusable templates.',
  favicon: 'img/favicon.ico',

  url: 'https://whats.fibe.gg',
  baseUrl: '/',
  organizationName: 'fibegg',
  projectName: 'whats.fibe.gg',
  trailingSlash: true,
  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  future: {v4: true},

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {label: 'English', htmlLang: 'en-US'},
    },
  },

  headTags: [
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/svg+xml', sizes: 'any', href: '/img/fibe.svg'}},
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', sizes: '180x180', href: '/img/apple-touch-icon.png'}},
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '192x192', href: '/img/icon-192.png'}},
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '512x512', href: '/img/icon-512.png'}},
    {tagName: 'link', attributes: {rel: 'manifest', href: '/site.webmanifest'}},
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'}},
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'}},
    {tagName: 'link', attributes: {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Play:wght@400;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap'}},
    {tagName: 'meta', attributes: {name: 'theme-color', content: '#191c14'}},
    {tagName: 'meta', attributes: {property: 'og:site_name', content: 'Fibe'}},
    {tagName: 'meta', attributes: {property: 'og:type', content: 'website'}},
    {tagName: 'meta', attributes: {name: 'twitter:card', content: 'summary_large_image'}},
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Fibe — user guide & skills',
        url: 'https://whats.fibe.gg',
        publisher: {'@type': 'Organization', name: 'Fibe', url: 'https://fibe.gg'},
      }),
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          showLastUpdateTime: true,
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        language: ['en'],
        docsRouteBasePath: '/',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 10,
        searchBarShortcutHint: true,
      }),
    ],
  ],

  plugins: [
    path.resolve(__dirname, './plugins/plugin-llms-txt.js'),
    path.resolve(__dirname, './plugins/plugin-og-images.js'),
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/og-default.png',
      metadata: [
        {name: 'description', content: 'Fibe user guide: Docker environments, AI Genies, reusable templates, automated jobs.'},
        {name: 'keywords', content: 'Fibe, fibe.gg, Docker, Docker Compose, dev environment, AI agent, Genie, Marquee, Playground, Trick, Bazaar, template, developer tools'},
        {name: 'author', content: 'Fibe'},
        {name: 'twitter:image:alt', content: 'Fibe — user guide'},
        {name: 'robots', content: 'index, follow, max-image-preview:large'},
      ],
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Fibe',
        logo: {
          alt: 'Fibe',
          src: 'img/fibe.svg',
          width: 28,
          height: 28,
        },
        items: [
          // GitHub + fibe.gg now live in the footer; the navbar keeps only the
          // search box and a gold "fibe →" CTA to its right.
          {type: 'search', position: 'right'},
          {
            href: 'https://fibe.gg/',
            label: 'fibe →',
            position: 'right',
            className: 'navbar__fibe-cta',
          },
        ],
      },
      footer: {
        // Footer is rendered by the swizzled component at src/theme/Footer/index.js.
        // This entry exists so Docusaurus doesn't complain — the swizzled component
        // reads its links from a single source within itself.
        style: 'dark',
        copyright: `© ${new Date().getFullYear()} fibe.gg`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['yaml', 'bash', 'ruby', 'docker'],
      },
    }),
};

export default config;
