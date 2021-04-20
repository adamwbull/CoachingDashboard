import { Dimensions, Appearance, StyleSheet } from 'react-native';

// Unchanging stylesheets and elements.
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

// Dynamic spreadsheets and elements.

export const logoDark = require('../assets/coachsync-logo-dark.png');

export const colorsDark = {
  primaryHighlight: '#2ecc71', // emerald
  secondaryHighlight: '#27ae60', // forest
  secondaryBackground: '#23272a', // forest
  mainTextColor: '#ecf0f1', // clouds
  secondaryTextColor: '#344150', // blueGray
  mainBackground: '#000000', // white
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
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  login: {
    flex:1,
    paddingLeft:50,
    paddingRight:50,
    paddingBottom:10,
    paddingTop:10,
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:colorsDark.mainBackground
  },
  features: {
    flex:2,
    height:'100%',
    backgroundColor:colorsDark.secondaryBackground
  },
  logoContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'flex-start'
  },
  logo: {
    width:120,
    height:60
  },
  form: {
    flex:1000,
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
  },
  title: {
    color:colorsDark.mainTextColor,
    fontSize:40,
    width:'100%',
    fontFamily:'Poppins'
  },
  subtitle: {
    color:colorsDark.mainTextColor,
    fontSize:18,
    width:'100%',
    marginBottom:25,
  },
  link: {
    color:btnColors.primary,
    fontSize:18,
    textDecorationLine: 'underline',
  },
  inputLabel: {
    fontFamily:'PoppinsSemiBold',
    color:colorsDark.mainTextColor,
    fontSize:20,
    width:'100%',
  },
  inputStyle: {
    color:colorsDark.mainTextColor,
    backgroundColor:colorsDark.secondaryBackground,
    borderRadius:10,
    padding:10,
    height:38,
    width:'100%',
    fontFamily:'Poppins',
    fontSize:18,
    marginBottom:20
  },
  submitButton: {
    fontFamily:'Poppins'
  },
  submitButtonContainer: {
    marginTop:20,
    width:'100%',
    backgroundColor:btnColors.primary,
    borderRadius:10,
  }
});
