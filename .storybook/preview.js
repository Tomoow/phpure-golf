import '../app/design/frontend/Phpure/golf/web/css/styles.css';

/** @type {import('storybook').Preview} */
const preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'Champagne Beige', value: '#fcf9f4' },
        { name: 'White', value: '#ffffff' },
        { name: 'Deep Emerald', value: '#004d40' },
        { name: 'Slate Dark', value: '#12191f' },
      ],
      default: 'Champagne Beige',
    },
  },
};

export default preview;
