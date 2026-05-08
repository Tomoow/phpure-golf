/** @type {import('storybook').StorybookConfig} */
const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|mjs)'],
  framework: '@storybook/html-vite',
};

export default config;
