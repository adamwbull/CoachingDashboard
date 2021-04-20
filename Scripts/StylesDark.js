import { Dimensions, Appearance, StyleSheet } from 'react-native';

// Unchanging stylesheets and elements.
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

// Dynamic spreadsheets and elements.

export const logoDark = '../assets/coachsync-logo-dark.png';

export const colorsDark = {
  primaryHighlight: '#2ecc71', // emerald
  secondaryHighlight: '#27ae60', // forest
  secondaryBackground: '#ecf0f1', // clouds
  mainTextColor: '#23272a', // darkGray
  secondaryTextColor: '#344150', // blueGray
  mainBackground: '#ffffff', // white
}

export const btnColors = {
  primary:'#3498db',
  caution:'#f1c40f',
  danger:'#e74c3c',
  success:'#2ecc71',
  info:'#48dbfb',
}

export const overviewDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsDark.mainBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    color:colorsDark.darkGray
  }
});

export const welcomeDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderLeftWidth:10,
    borderLeftColor:colorsDark.secondaryHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    color:colorsDark.mainTextColor
  }
});
