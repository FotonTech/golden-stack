declare module 'styled-components' {
  export interface DefaultTheme {
    primaryBackground: string;
    secondaryBackground: string;
    success: string;
    danger: string;
    warn: string;
    primary: string;
    darkPrimary: string;
    secondary: string;
    primaryTitle: string;
    secondaryTitle: string;
    primaryText: string;
    secondaryText: string;
    placeholderText: string;
    inverseText: string;
    disabled: string;
    darkGrey: string;
    subtitleSize: number;
    sectionSize: number;
    subsectionSize: number;
    titleSize: number;
    textSize: number;
    subtextSize: number;
    screenPadding: number;
    tablet: string;
    laptop: string;
    laptopL: string;
    topShadow: string;
    shadow: string;
    shadow5: string;
  }
}

const theme = {
  primaryBackground: '#ffffff',
  secondaryBackground: '#464646',
  success: '#00C77E',
  danger: '#E93F4B',
  warn: '#FF8A00',
  primary: '#6100F3',
  darkPrimary: '#5404CC',
  secondary: '#FFFFFF',
  primaryTitle: '#363636',
  secondaryTitle: '#6100F3',
  primaryText: '#808080',
  secondaryText: '#363636',
  placeholderText: '#AFAFAF',
  inverseText: '#000',
  disabled: '#C4C4C4',
  darkGrey: '#29262F',
  subtitleSize: 18,
  sectionSize: 35,
  subsectionSize: 27,
  titleSize: 50,
  textSize: 20,
  subtextSize: 15,
  screenPadding: 30,
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  topShadow: '0 -5px 5px -5px rgba(0,0,0,0.12), 0 -5px 5px -5px rgba(0,0,0,0.24)',
  shadow: '0px 0px 40px rgba(0, 0, 0, 0.06)',

  shadow5: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
};

export default theme;
