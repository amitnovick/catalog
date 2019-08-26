module.exports = {
  title: 'Catalog',
  logo: '/horizontal-logo.png',
  description: 'Just playing around',
  themeConfig: {
    search: false,
    nav: [{ text: 'GitHub', link: 'https://github.com/amitnovick/catalog' }],
    sidebar: [
      {
        title: 'Guides',
        children: ['/getting-started', '/categories'],
      },
    ],
  },
};
