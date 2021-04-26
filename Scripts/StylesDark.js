import { Dimensions, Appearance, StyleSheet } from 'react-native';

// Unchanging stylesheets and elements.
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;


export const logoDark = require('../assets/coachsync-logo-dark.png');

export const colorsDark = {
  primaryHighlight: '#2ecc71', // emerald
  secondaryHighlight: '#27ae60', // forest
  secondaryBackground: '#23272a', // forest
  mainTextColor: '#ecf0f1', // clouds
  secondaryTextColor: '#344150', // blueGray
  mainBackground: '#000000', // white
  header: '#1e2746'
}

export const btnColors = {
  primary:'#3498db',
  caution:'#f1c40f',
  danger:'#e74c3c',
  success:'#2ecc71',
  info:'#48dbfb',
}

export const boxColors = {
  primary:'#38A2E8',
  caution:'#FFCF0F',
  danger: '#fb7161',
  success:'#32D977',
  info:'#48dbfb',
}

// Dynamic spreadsheets and elements.

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
  linkBlend: {
    color:colorsDark.mainTextColor,
    fontSize:14,
    textDecorationLine: 'underline',
  },
  inputLabel: {
    fontFamily:'PoppinsSemiBold',
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

export const signUpDark = StyleSheet.create({
  container: {
    backgroundColor:colorsDark.secondaryBackground,
    alignItems:'center',
    borderLeftWidth:20,
    borderLeftColor:colorsDark.secondaryHighlight,
    borderRightColor:colorsDark.secondaryHighlight,
    borderRightWidth:20,
  },
  main: {
    flexDirection:'row',
    paddingLeft:50,
    paddingRight:50,
    paddingBottom:10,
    paddingTop:10,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
  },
  logoContainer: {
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
  },
  pricingTitle: {
    fontSize:40,
    textAlign:'center',
    fontFamily:'Poppins',
    flex: 1, flexWrap: 'wrap'
  },
  pricingIntro: {
    fontSize:20,
    marginBottom:5,
    textAlign:'center',
    fontFamily:'Poppins',
    flex: 1,
    flexWrap: 'wrap'
  },
  pricingCards: {
    flex:1,
    marginTop:5,
    justifyContent:'center',
    alignItems:'center'
  },
  pricingCardContainer: {
    width:350,
    height:420,
    justifyContent:'center'
  },
  prevPriceHeight: {
    height:55
  },
  pricingHighlight: {
    textAlign:'center',
    fontFamily:'PoppinsSemiBold',
    fontSize:30,
    color:colorsDark.secondaryTextColor,
  },
  pricingCardContainerMiddle: {
    width:400,
    marginTop:0,
    padding:20
  },
  logo: {
    width:200,
    marginTop:10,
    height:100
  },
  form: {
    flex:1000,
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    marginBottom:20,
    flexShrink:1
  },
  title: {
    color:colorsDark.mainTextColor,
    fontSize:40,
    textAlign:'center',
    width:'100%',
    fontFamily:'Poppins'
  },
  subtitle: {
    color:colorsDark.mainTextColor,
    fontSize:18,
    textAlign:'center',
    width:'100%',
    marginBottom:25,
  },
  link: {
    color:btnColors.primary,
    fontSize:18,
    textDecorationLine: 'underline',
  },
  linkBlend: {
    color:colorsDark.mainTextColor,
    fontSize:14,
    textDecorationLine: 'underline',
  },
  formRow: {
    alignItems:'center',
    justifyContent:'center'
  },
  formColumn: {
    margin:10,
    width:350,
  },
  inputLabel: {
    fontFamily:'PoppinsSemiBold',
    fontSize:20,
    width:'100%',
  },
  inputStyle: {
    color:colorsDark.mainTextColor,
    backgroundColor:colorsDark.mainBackground,
    borderRadius:10,
    padding:10,
    height:46,
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
    width:400,
    backgroundColor:btnColors.primary,
    borderRadius:10,
  },
  paymentFormContainer: {
    width:'80%',
    justifyContent:'center',
    alignItems:'center',
  },
  backContainer: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:10,
  },
  iconStyle: {
    marginRight:5,
  },
  backText: {
    fontSize:20,
    textAlign:'left',
    flex:1,
    fontFamily:'Poppins',
    width:100,
    flexWrap: 'wrap'
  },
  paymentForm: {
    width:'100%',
    backgroundColor:colorsDark.mainBackground,
    flexDirection:'row'
  },
  paymentInfo: {
    flex:7,
    padding:20,
    backgroundColor:colorsDark.secondaryHighlight
  },
  paymentMain: {
    flex:6,
    padding:50,
    flexDirection:'column',
    justifyContent:'space-between'
  },
  previousPriceContainer: {
    backgroundColor:boxColors.danger,
    width:200,
    marginLeft:15,
    borderRadius:10,
    padding:5,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },
  previousPriceInner: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  discountDesc: {
    color:'#ffffff',
    fontSize:20,
  },
  previousPrice: {
    fontSize:26,
    color:'#ffffff',
    textDecorationLine:'line-through'
  },
  previousPriceDiscount: {
    fontSize:20,
    marginLeft:5,
    color:'#ffffff'
  },
  activeDiscountDesc: {
    textAlign:'center',
    marginTop:5,
    fontSize:16,
    color:colorsDark.secondaryTextColor
  },
  timeLeft: {
    fontSize:22,
    marginBottom:5,
    fontFamily:'Poppins',
    color:colorsDark.mainTextColor,
    textAlign:'center'
  },
  countdown: {
    fontSize:22,
    fontFamily:'Poppins',
    color:btnColors.danger
  },
  priceBottomText: {
    fontSize:20,
    textAlign:'center',
    color:colorsDark.secondaryTextColor,
    marginBottom:10
  },
  toggleAnnual: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  groupButton: {
    width:200,
    height:40
  },
  paymentSubmitButton: {
    margin:0,
    backgroundColor:btnColors.primary,
  },
  paymentSubmitButtonContainer: {
    margin:10,
    paddingLeft:0,
    paddingRight:0,
  },
  paymentItem: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:10
  },
  paymentItemTitle: {
    color:'#fff',
    fontFamily:'PoppinsSemiBold',
    fontSize:24
  },
  paymentItemMemo: {
    color:'#fff',
    fontFamily:'Poppins',
    fontSize:14
  },
  paymentItemAmount: {
    justifyContent:'center',
    alignItems:'center'
  },
  paymentDiscountAmount: {
    color:'#fff',
    fontFamily:'Poppins',
    fontSize:14,
    textDecorationLine:'line-through'
  },
  paymentPrimaryAmount: {
    color:'#fff',
    fontFamily:'PoppinsSemiBold',
    fontSize:18,
  },
  paymentIcon: {
    alignItems:'flex-start',
    justifyContent:'center'
  },
  paymentEnterInfo: {
    marginTop:30,
    marginBottom:30
  },
  paymentCardBack: {
    flexDirection:'row'
  },
  paymentStripe: {
    width:150,
    height:34,
    alignSelf:'flex-end'
  },
  stripeSection: {
    flex:1,
    alignItems:'flex-end',
    justifyContent:'flex-end'
  },
  inputCardName: {
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    borderWidth:1,
    fontSize:16,
    color:colorsDark.mainTextColor,
    borderColor:colorsDark.secondaryBackground,
    padding:15,
    marginLeft:10,
    marginRight:10,
    marginTop:10,
    fontWeight:'1000',
  },
  cardWrapper: {
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    borderLeftWidth:1,
    borderRightWidth:1,
    borderBottomWidth:1,
    borderColor:colorsDark.secondaryBackground,
    padding:15,
    marginLeft:10,
    marginRight:10,
    marginBottom:10
  },
  paymentBottomText: {
    textAlign:'center',
    color:colorsDark.mainTextColor,
    fontSize:12
  },
  congratsContainer: {
    borderRadius:10,
    backgroundColor:colorsDark.mainBackground,
    width:400
  },
  congratsHeader: {
    backgroundColor:colorsDark.secondaryHighlight,
    height:80,
  },
  congratsBody: {
    padding:20
  },
  congratsIcon: {
    width:100,
    height:100,
    position:'absolute',
    top:-50,
    left:150,
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    backgroundColor:colorsDark.mainBackground,
    borderWidth:2,
    borderRadius:100,
    borderColor:colorsDark.secondaryBackground
  },
  congratsTitle: {
    marginTop:40,
    fontFamily:'Poppins',
    fontSize:26,
    textAlign:'center',
    color:colorsDark.mainTextColor
  },
  congratsText: {
    fontFamily:'Poppins',
    fontSize:14,
    textAlign:'center',
    color:colorsDark.mainTextColor
  },
  congratsButton: {
    borderRadius:100,
    backgroundColor:colorsDark.secondaryHighlight,
  },
  congratsButtonContainer: {
    width:'50%',
    marginTop:20,
    marginLeft:'25%'
  }
});

export const drawerDark = StyleSheet.create({
  drawer: {
    backgroundColor:colorsDark.primaryHighlight
  }
})

export const innerDrawerDark = StyleSheet.create({
  container: {
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    backgroundColor:colorsDark.mainBackground,
    flex:1
  }
})

export const homeDark = StyleSheet.create({
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
