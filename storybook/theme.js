import { create } from '@storybook/theming';

export default create({
  name: 'organw',

  base: 'light',

  brandTitle: 'OrganW React',
  brandUrl: 'https://github.com/organw/organw-react',
  brandImage: 'logo.svg',

  colorPrimary: '#13AA52',
  colorSecondary: '#13AA52',

  // UI
  appBg: '#F4F6F6',
  appContentBg: '#FFFFFF',
  appBorderColor: '#D7DBDB',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Akzidenz", Helvetica, Arial, sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#303434',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'silver',
  barSelectedColor: '#13AA52',
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#F4F6F6',
  inputBorder: '#D7DBDB',
  inputTextColor: '#303434',
  inputBorderRadius: 4,
});
