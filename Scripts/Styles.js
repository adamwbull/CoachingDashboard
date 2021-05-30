import { Dimensions, Appearance, StyleSheet } from 'react-native';
import { set, get, getTTL, ttl } from '../Scripts/Storage.js'

// Unchanging stylesheets and elements.
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const navLogo = require('../assets/nav-logo.png');

export const bold = {
  fontFamily:'PoppinsSemiBold'
}

export const btnColors = {
  primary:'#3498db',
  caution:'#f1c40f',
  danger:'#e74c3c',
  success:'#2ecc71',
  info:'#41C3E0',
  lightBackground: '#FAFAFA',
}

export const boxColors = {
  primary:'#38A2E8',
  caution:'#FFCF0F',
  danger: '#fb7161',
  success:'#32D977',
  info:'#48dbfb',
  default:'#FAFAFA'
}

var coach = get('Coach')
if (coach == null) {
  coach = {}
  coach.PrimaryHighlight = '#2ecc71'
  coach.SecondaryHighlight = '#27ae60'
}

export const colorsLight = {
  primaryHighlight: coach.PrimaryHighlight,
  secondaryHighlight: coach.SecondaryHighlight,
  secondaryBackground: '#ebeef6', // clouds
  mainTextColor: '#23272a', // darkGray
  secondaryTextColor: '#344150', // blueGray
  mainBackground: '#ffffff', // white
  header: '#FAFAFA',
  headerBorder: '#ebeef6',
}

export const messageBox = StyleSheet.create({
  errorBox: {
    paddingTop:20,
    paddingBottom:20,
    paddingLeft:10,
    paddingRight:10,
    backgroundColor:boxColors.danger,
    width:'100%',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:10,
    borderRadius:10,
  },
  icon: {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  text: {
    flex:6,
    fontSize:14,
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor
  }
});


export const logoLight = require('../assets/coachsync-logo-light.png');

// Dynamic spreadsheets and elements.

export const welcomeLight = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderLeftWidth:10,
    borderLeftColor:colorsLight.secondaryHighlight,
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
    backgroundColor:colorsLight.mainBackground
  },
  features: {
    flex:2,
    height:'100%',
    backgroundColor:colorsLight.secondaryBackground
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
    color:colorsLight.mainTextColor,
    fontSize:40,
    width:'100%',
    fontFamily:'Poppins'
  },
  subtitle: {
    color:colorsLight.mainTextColor,
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
    color:colorsLight.mainTextColor,
    fontSize:14,
    textDecorationLine: 'underline',
  },
  inputLabel: {
    fontFamily:'PoppinsSemiBold',
    fontSize:20,
    width:'100%',
  },
  inputStyle: {
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.secondaryBackground,
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

export const signUpLight = StyleSheet.create({
  container: {
    backgroundColor:colorsLight.secondaryBackground,
    alignItems:'center',
    borderLeftWidth:20,
    borderLeftColor:colorsLight.secondaryHighlight,
    borderRightColor:colorsLight.secondaryHighlight,
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
    height:440,
    justifyContent:'center'
  },
  prevPriceHeight: {
    height:55
  },
  pricingHighlight: {
    textAlign:'center',
    fontFamily:'PoppinsSemiBold',
    fontSize:30,
    color:colorsLight.secondaryTextColor,
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
    color:colorsLight.mainTextColor,
    fontSize:40,
    textAlign:'center',
    width:'100%',
    fontFamily:'Poppins'
  },
  subtitle: {
    color:colorsLight.mainTextColor,
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
    color:colorsLight.mainTextColor,
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
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.mainBackground,
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
    backgroundColor:colorsLight.mainBackground,
    flexDirection:'row'
  },
  paymentInfo: {
    flex:7,
    padding:20,
    backgroundColor:colorsLight.secondaryHighlight
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
    color:colorsLight.secondaryTextColor
  },
  timeLeft: {
    fontSize:22,
    marginBottom:5,
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor,
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
    color:colorsLight.secondaryTextColor,
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
    color:colorsLight.mainTextColor,
    borderColor:colorsLight.secondaryBackground,
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
    borderColor:colorsLight.secondaryBackground,
    padding:15,
    marginLeft:10,
    marginRight:10,
    marginBottom:10
  },
  paymentBottomText: {
    textAlign:'center',
    color:colorsLight.mainTextColor,
    fontSize:12
  },
  congratsContainer: {
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    width:400
  },
  congratsHeader: {
    backgroundColor:colorsLight.secondaryHighlight,
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
    backgroundColor:colorsLight.mainBackground,
    borderWidth:2,
    borderRadius:100,
    borderColor:colorsLight.secondaryBackground
  },
  congratsTitle: {
    marginTop:40,
    fontFamily:'Poppins',
    fontSize:26,
    textAlign:'center',
    color:colorsLight.mainTextColor
  },
  congratsText: {
    fontFamily:'Poppins',
    fontSize:14,
    textAlign:'center',
    color:colorsLight.mainTextColor
  },
  congratsButton: {
    borderRadius:100,
    backgroundColor:colorsLight.secondaryHighlight,
  },
  congratsButtonContainer: {
    width:'50%',
    marginTop:20,
    marginLeft:'25%'
  }
});

export const drawerLight = StyleSheet.create({
  drawer: {
    backgroundColor:colorsLight.secondaryHighlight,
    padding:0,
    margin:0,
    width:80,
    borderWidth:0,
  },
  drawerItem: {
    padding:0,
    margin:0,
    backgroundColor:'',
    borderWidth:0,
  },
  header: {
    width:'100%',
    flexDirection:'row',
    backgroundColor:colorsLight.mainBackground
  },
  headerLogoContainer: {
    width:80,
    borderRightColor:colorsLight.mainBackground,
    borderRightWidth:1,
    backgroundColor:colorsLight.secondaryHighlight,
  },
  headerLogo: {
    width:80,
    height:80,
    tintColor:colorsLight.mainBackground,
  },
  headerTextContainer: {
    width:200,
    borderBottomWidth:1,
    borderBottomColor:colorsLight.headerBorder,
    justifyContent:'center',
    alignItems:'center'
  },
  headerText: {
    fontFamily:'PoppinsSemiBold',
    fontSize:25,
    textAlign:'center',
    lineHeight:25,
  },
  headerMain: {
    flex:1,
    backgroundColor:colorsLight.header,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center'
  },
  headerUser: {
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    height:80
  },
  headerIcon: {
    justifyContent:'center',
    alignItems:'center',
    marginRight:10,
    padding:5,
    width:40,
    height:40,
    borderRadius:10,
    backgroundColor:colorsLight.secondaryBackground
  },
  headerUserBox: {
    height:40,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'flex-end',
    paddingRight:10,
    width:200,
  },
  headerUserBoxText: {
    justifyContent:'center',
    alignItems:'left',
    height:40
  },
  headerUserName: {
    fontSize:14,
    lineHeight:14,
    fontFamily:'PoppinsSemiBold'
  },
  headerPlan: {
    fontSize:12,
    lineHeight:14,
    fontFamily:'Poppins'
  },
  headerAvatar: {
    width:40,
    height:40,
    borderRadius:10,
    backgroundColor:colorsLight.secondaryBackground,
    marginRight:10,
  },
  messagesContainer: {
    width:80,
    height:80,
    backgroundColor:colorsLight.header,
    borderLeftColor:colorsLight.headerBorder,
    borderLeftWidth:1,
    justifyContent:'center',
    alignItems:'center'
  },
  dropdownBox: {
    padding:15,
    position:'absolute',
    right:80,
    top:70,
    width:200,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    borderWidth:1,
    borderColor:colorsLight.headerBorder
  },
  dropdownBoxText: {
    fontFamily:'Poppins',
    fontSize:14,
    paddingBottom:4,
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1,
    color:colorsLight.mainTextColor
  },
  dropdownBoxLogoutContainer: {
    paddingTop:4,
    flexDirection:'row',
    alignItems:'center'
  },
  dropdownBoxLogout: {
    fontFamily:'Poppins',
    fontSize:14,
    color:btnColors.danger,
    marginLeft:3
  }
})

export const innerDrawerLight = StyleSheet.create({
  drawer: {
    backgroundColor:colorsLight.mainBackground,
    height:'100%',
    width:200,
  },
  drawerTop: {
    backgroundColor:colorsLight.mainBackground,
    width:200,
    paddingLeft:20,
    paddingRight:20,
    paddingTop:23,
    height:60,
    paddingBottom:0,
  },
  drawerTopTitle: {
    fontSize:22,
    fontFamily:'PoppinsSemiBold',
    borderBottomWidth:2,
    color:colorsLight.mainTextColor,
    borderBottomColor:colorsLight.mainTextColor
  }
})

export const homeLight = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth:0,
  },
  main: {
    flex:1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:0,
  },
  body: {
    flex:4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:0,
  },
  h1: {
    color:colorsLight.darkGray
  }
});

export const promptsLight = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex:1,
    flexDirection:'row',
  },
  scrollView: {
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20
  },
  body: {
    flex:1,
    borderWidth:0,
  },
  bodyHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  bodyTitleGroup: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyTitle: {
    color:colorsLight.darkGray,
    fontSize:26,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodyDesc: {
    color:colorsLight.darkGray,
    fontSize:14,
    lineHeight:14,
    fontFamily:'Poppins'
  },
  bodyHeaderNav: {
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center'
  },
  bodyHeaderNavLink: {
    justifyContent:'center',
    alignItems:'center',
    fontFamily:'Poppins',
    fontSize:14
  },
  promptListContainer: {
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  promptHeader: {
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:colorsLight.headerBorder,
    justifyContent:'space-between',
    alignItems:'flex-end',
    paddingBottom:5
  },
  promptHeaderTitle: {
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
    fontSize:24,
    paddingLeft:5,
    paddingRight:10,
  },
  promptHeaderCount: {
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor,
    fontSize:16
  },
  promptsRow: {
    paddingTop:10,
    flexDirection:'row'
  },
  addPromptContainer: {
    width:200,
    height:200,
    borderWidth:1,
    borderColor:colorsLight.headerBorder,
    backgroundColor:colorsLight.header,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    marginRight:10,
  },
  promptAddButtonTitle: {
    fontSize:14,
    fontFamily:'Poppins'
  },
  promptAddButton: {
    backgroundColor:btnColors.primary,
    borderRadius:50,
    padding:5,
  },
  promptAddButtonContainer: {
    width:'70%'
  },
  innerRow: {
    flexDirection:'row',
    marginBottom:10
  },
  taskBox: {
    width:200,
    height:200,
    borderWidth:1,
    borderColor:colorsLight.headerBorder,
    borderRadius:10,
    overflow:'hidden',
    marginRight:10
  },
  taskPreview: {
    flex:1,
  },
  taskPreviewHeader: {
    flexDirection:'row',
    alignItems:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  taskPreviewHeaderIcon: {
    padding:10,
    borderRightColor:colorsLight.headerBorder,
    borderRightWidth:1
  },
  taskPreviewTitle: {
    flex:1,
    marginLeft:10,
    fontSize:16,
    color:colorsLight.mainTextColor,
    fontFamily:'PoppinsSemiBold'
  },
  taskPreviewText: {
    fontSize:14,
    padding:10,
    color:colorsLight.mainTextColor,
    textAlign:'left',
    fontFamily:'Poppins'
  },
  taskWarningText: {
    fontSize:14,
    padding:10,
    color:btnColors.danger,
    textAlign:'center',
    fontFamily:'Poppins'
  },
  taskButtons: {
    flexDirection:'row'
  },
  taskButtonTop: {
    width:'100%',
    borderTopWidth:1,
    borderTopColor:colorsLight.headerBorder,
    padding:1,
    backgroundColor:colorsLight.header
  },
  taskButtonLeft: {
    flex:1,
    borderTopWidth:1,
    borderRightWidth:0.5,
    borderTopColor:colorsLight.headerBorder,
    borderRightColor:colorsLight.headerBorder,
    padding:10,
    backgroundColor:btnColors.info
  },
  taskButtonRight: {
    flex:1,
    borderTopWidth:1,
    borderLeftWidth:0.5,
    borderTopColor:colorsLight.headerBorder,
    borderLeftColor:colorsLight.headerBorder,
    padding:10,
    backgroundColor:btnColors.danger
  },
  taskButtonText: {
    color:'#ffffff',
    fontSize:14,
    fontFamily:'Poppins',
    textAlign:'center'
  },
  helpBox: {
    width:400,
    height:200,
    justifyContent:'center',
    alignItems:'center'
  },
  helpBoxText: {
    fontFamily:'Poppins',
    textAlign:'center',
    fontSize:14,
    color:colorsLight.mainTextColor
  },
  helpBoxError: {
    fontFamily:'PoppinsSemiBold',
    textAlign:'center',
    fontSize:14,
    color:colorsLight.mainTextColor
  },
  standardPlanText: {
    color:btnColors.success,
  },
  proPlanText: {
    color:btnColors.danger
  },
  newPromptContainer: {
    padding:20,
    borderRadius:10,
    marginBottom:20,
    backgroundColor:colorsLight.mainBackground,
  },
  newPromptHeader: {
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    paddingBottom:5,
    borderBottomWidth:1,
    borderBottomColor:colorsLight.headerBorder
  },
  newPromptDescTitle: {
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
    fontSize:24,
    paddingLeft:5,
    paddingRight:10,
  },
  newPromptBody: {
    flexDirection:'row',
    padding:10,
  },
  newPromptForm: {
    flex:3,
  },
  newPromptVideoSection: {
    flex:2,
    paddingLeft:10,
    paddingRight:10,
    marginLeft:10,
  },
  newPromptTitleLabel: {
    color:colorsLight.mainTextColor,
    fontFamily:'PoppinsSemiBold',
    fontSize:18,
  },
  inputStyle: {
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10,
    padding:10,
    width:'100%',
    fontFamily:'Poppins',
    fontSize:18,
    marginBottom:20
  },
  newPromptVideoEmpty: {
    borderRadius:10,
    borderColor:colorsLight.secondaryTextColor,
    borderWidth:1,
    borderStyle:'dashed',
    justifyContent:'center',
    alignItems:'center',
    flex:1
  },
  newPromptVideoEmptyText: {
    fontSize:16,
    fontFamily:'Poppins',
    textAlign:'center',
    color:colorsLight.secondaryTextColor
  },
  newPromptFooter: {
    flex:1,
  },
  newPromptAddButtonTitle: {
    fontSize:16,
    fontFamily:'Poppins'
  },
  newPromptAddButton: {
    backgroundColor:btnColors.primary,
    borderRadius:50,
    padding:5,
  },
  newPromptAddButtonContainer: {
    width:'60%',
    paddingLeft:10,
    paddingRight:20
  },
  showVideoOptions: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    padding:20
  },
  showVideoOptionsChooseUpload: {
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    borderColor:colorsLight.secondaryTextColor,
    borderWidth:1,
    borderStyle:'dashed',
    width:'40%',
    height:200,
    marginRight:10
  },
  showVideoOptionsChooseUploadTitle: {
    fontFamily:'Poppins',
    fontSize:16,
    textAlign:'center',
    color:colorsLight.secondaryTextColor
  },
  showVideoOptionsChooseUploadTypes: {
    fontFamily:'Poppins',
    fontSize:14,
    textAlign:'center',
    color:colorsLight.secondaryTextColor
  },
  showVideoOptionsChooseUploadSize: {
    fontFamily:'Poppins',
    fontSize:14,
    textAlign:'center',
    color:colorsLight.secondaryTextColor
  },
  showVideoOptionsChooseYouTube: {
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    borderColor:colorsLight.secondaryTextColor,
    borderWidth:1,
    borderStyle:'dashed',
    width:'40%',
    height:200,
    marginLeft:10
  },
  selectUploadContainer: {
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center',
  },
  uploadProgressTitle: {
    fontFamily:'Poppins',
    fontSize:16,
    color:colorsLight.mainTextColor,
    textAlign:'center',
    marginBottom:10,
    marginTop:20
  },
  uploadInputStyle: {
    marginBottom:10
  },
  uploadFileTitle: {
    fontSize:16,
    fontFamily:'Poppins',
  },
  uploadFileTitleButton: {
    marginTop:10,
    backgroundColor:btnColors.success,
    borderRadius:50,
    padding:10,
  },
  uploadFileTitleButtonContainer: {
    padding:5,
  },
  videoError: {
    fontSize:14,
    fontFamily:'Poppins',
    color:btnColors.danger,
    textAlign:'center'
  },
  reactPlayerContainer: {
    width:500,
    height:280,
    aspectRatio:16/9,
  },
  viewPromptBodyText: {
    fontSize:16,
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor
  },
  newPromptBodyLeft: {
    flex:1,
  },
  videoGoBack: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
    marginTop:10
  },
  videoGoBackText: {
    fontFamily:'Poppins',
    fontSize:20,
    color:colorsLight.mainTextColor
  },
  youTubeSection: {
  },
  noPromptResponses: {
    fontFamily:'Poppins',
    fontSize:18,
    color:colorsLight.mainTextColor,
    marginTop:10,
    marginLeft:5
  },
  addSurveyBody: {
    flexDirection:'row',
    marginBottom:20,
    borderLeftColor:colorsLight.headerBorder,
    borderRightColor:colorsLight.headerBorder,
    borderBottomColor:colorsLight.headerBorder,
    borderLeftWidth:1,
    borderRightWidth:1,
    borderBottomWidth:1
  },
  addSurveyListContainer: {
    flex:2,
    backgroundColor:colorsLight.header,
    borderRightWidth:1,
    borderRightColor:colorsLight.headerBorder,
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10
  },
  addSurveyListButton: {
    borderRadius:50
  },
  addSurveyListButtonContainer: {
    padding:20,
  },
  addSurveyListDropdown: {
    position:'absolute',
    width:'80%',
    backgroundColor:colorsLight.mainBackground,
    borderWidth:1,
    borderColor:colorsLight.headerBorder,
    borderRadius:10,
    padding:10,
    left:'10%',
    top:60,
  },
  addSurveyListDropdownTouch: {
    paddingLeft:10,
    paddingTop:4,
    paddingBottom:4,
    borderBottomWidth:1,
    borderBottomColor:colorsLight.headerBorder,
    cursor:'pointer'
  },
  addSurveyListDropdownTouchBottom: {
    paddingLeft:10,
    paddingTop:4,
    paddingBottom:4,
    cursor:'pointer'
  },
  addSurveyListDropdownText: {
    fontFamily:'Poppins',
    fontSize:16,
    color:colorsLight.mainTextColor
  },
  addSurveyList: {
    justifyContent:'flex-start',
    flex:5,
  },
  programTask: {
    backgroundColor:colorsLight.mainBackground,
    flexDirection:'row',
    marginBottom:10,
    borderTopColor:colorsLight.headerBorder,
    borderBottomColor:colorsLight.headerBorder,
    borderTopWidth:2,
    borderBottomWidth:2
  },
  programTaskMain: {
    flex:1,
    padding:20,
    flexDirection:'row',
    alignItems:'center',
    cursor:'pointer'
  },
  programTaskIcon: {
    marginRight:15,
  },
  programTaskTitle: {
    fontFamily:'Poppins',
    fontSize:16,
    color:colorsLight.mainTextColor
  },
  programTaskNav: {
    width:40,
    justifyContent:'space-between',
    paddingTop:4,
    paddingBottom:4
  },
  planRequiredText: {
    fontFamily:'PoppinsSemiBold',
    fontSize:12,
    color:colorsLight.mainTextColor,
  },
  addSurveyMainContainer: {
    flex:3,
    minHeight:300,
    alignItems:'center',
    justifyContent:'center',
  },
  addSurveyMainHelpText: {
    fontSize:16,
    fontFamily:'Poppins',
    textAlign:'center',
    color:colorsLight.mainTextColor
  },
  addSurveyMain: {
    flex:1,
    width:'100%',
    padding:20,
  },
  addSurveyMainHeader: {
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1,
    paddingBottom:10,
    paddingLeft:5,
    paddingRight:5,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  addSurveyMainHeaderLeft: {
    flexDirection:'row',
    flex:3,
    alignItems:'center'
  },
  addSurveyMainHeaderRight: {
    justifyContent:'center',
    flex:1,
    cursor:'pointer'
  },
  addSurveyMainHeaderDelete: {
    color:btnColors.danger,
    fontFamily:'Poppins',
    fontSize:16,
    textAlign:'right',
  },
  addSurveyMainHeaderTaskText: {
    fontFamily:'PoppinsSemiBold',
    fontSize:16,
    textAlign:'left',
    marginRight:10,
  },
  addSurveyMainHeaderTitle: {
    fontFamily:'Poppins',
    fontSize:22,
    textAlign:'left'
  },
  addSurveyMainBody: {
    paddingTop:15,
    justifyContent:'flex-start',
    alignItems:'flex-start',
  },
  addSurveyMainSearch: {
    zIndex:999
  },
  chosenTask: {
    flex:1,
    marginLeft:20,
  },
  chosenTaskTitle: {
    fontSize:22,
    marginTop:10,
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor
  },
  chosenTaskText: {
    fontSize:16,
    fontFamily:'Poppins',
    marginTop:5,
    color:colorsLight.mainTextColor
  },
  searchTaskText: {
    fontFamily:'PoppinsSemiBold',
    fontSize:14,
    color:colorsLight.mainTextColor,
  },
  addSurveyFooter: {
    flexDirection:'row',
    borderTopWidth:1,
    borderTopColor:colorsLight.headerBorder,
  },
  surveyTaskQuestion: {
    fontFamily:'Poppins',
    fontSize:12,
    color:colorsLight.mainTextColor
  },
  inputSliderInfo: {

  },
  inputSliderInfoRange: {
    flexDirection:'row',
    alignItems:'center',
    marginBottom:20
  },
  inputSliderInfoRangeSpacer: {
    padding:10,
  },
  dropdownContainer: {
    padding:5,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10
  },
  inputSliderTextContainer: {
    flexDirection:'row',
    alignItems:'center',
    marginBottom:10
  },
  inputSliderNumDisplay: {
    fontFamily:'PoppinsSemiBold',
    fontSize:20,
    color:colorsLight.mainTextColor,
    textAlign:'center',
    height:30,
    width:30,
    marginRight:10
  },
  inputSliderTextTitle: {
    fontFamily:'PoppinsSemiBold',
    fontSize:16,
    color:colorsLight.mainTextColor,
  },
  inputSliderTextLabel: {
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor,
    fontSize:14,
    borderRadius:10,
    padding:10,
    backgroundColor:colorsLight.secondaryBackground
  },
  surveyBoxes: {
    justifyContent:'flex-start',
    alignItems:'center',
    flex:1,
    marginBottom:10
  },
  boxItem: {
    flexDirection:'row',
    alignItems:'center',
    marginTop:10,
    paddingTop:15,
    marginBottom:10,
    borderTopWidth:1,
    borderTopColor:colorsLight.headerBorder
  },
  boxItemInput: {
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10,
    padding:10,
    width:'50%',
    fontFamily:'Poppins',
    fontSize:14,
  },
  boxItemNav: {
    backgroundColor:colorsLight.mainBackground,
    marginRight:10
  },
  responseRow: {
    flexDirection:'column',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1,
    backgroundColor:colorsLight.secondaryBackground
  },
  responseClientInfo: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:10,
    backgroundColor:colorsLight.header
  },
  responseClientInfoInner: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  responseClientText: {
    fontSize:18,
    color:colorsLight.mainTextColor,
    fontFamily:'Poppins',
    marginLeft:10,
  },
  responseClientCreated: {
    fontSize:16,
    color:colorsLight.mainTextColor,
    fontFamily:'Poppins',
  },
  responseTextInfo: {
    padding:5
  },
  responseText: {
    fontSize:16,
    color:colorsLight.mainTextColor,
    fontFamily:'Poppins',
  },
  surveyResponseContainer: {
    padding:5,
  },
  surveyQuestion: {
    fontSize:20,
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
  },
  surveyResponseText: {
    fontSize:18,
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor,
  },
  sliderThumb: {
    width:10,
    height:10,
    backgroundColor:colorsLight.primaryHighlight
  },
  sliderRow: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  sliderInfo: {
    alignItems:'center',
    justifyContent:'center',
    padding:5
  },
  sliderLeftVal: {
    fontSize:18,
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
  },
  sliderDesc: {
    fontSize:14,
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
  },
  sliderVal: {
    fontSize:18,
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
  },
  sliderResponse: {
    fontSize:14,
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
    textAlign:'center'
  },
  surveyBoxRow: {
    flexDirection:'row',
    alignItems:'center',
    padding:5
  },
  boxText: {
    fontSize:18,
    fontFamily:'Poppins',
    marginLeft:10,
    color:colorsLight.mainTextColor,
  },
  surveyDataRow: {
    marginBottom:10
  },
  sliderOuter: {
    flex:1,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10,
    overflow:'hidden'
  },
  sliderInner: {
    height:'100%',
    padding:10,
    justifyContent:'center',
    backgroundColor:colorsLight.secondaryHighlight
  },
  sliderInnerText: {
    fontFamily:'Poppins',
    textAlign:'right',
    fontSize:16,
    color:'#fff'
  }
});

export const conceptsLight = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex:1,
    flexDirection:'row',
  },
  scrollView: {
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20
  },
  body: {
    flex:1,
    borderWidth:0,
  },
  bodyHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  bodyTitleGroup: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyTitle: {
    color:colorsLight.darkGray,
    fontSize:26,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodyDesc: {
    color:colorsLight.darkGray,
    fontSize:14,
    lineHeight:14,
    fontFamily:'Poppins'
  },
  bodyHeaderNav: {
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center'
  },
  bodyHeaderNavLink: {
    justifyContent:'center',
    alignItems:'center',
    fontFamily:'Poppins',
    fontSize:14
  },
  conceptListContainer: {
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  conceptHeader: {
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:colorsLight.headerBorder,
    justifyContent:'space-between',
    alignItems:'flex-end',
    paddingBottom:5
  },
  conceptHeaderTitle: {
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
    fontSize:24,
    paddingLeft:5,
    paddingRight:10,
  },
  conceptHeaderCount: {
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor,
    fontSize:16
  },
  conceptsRow: {
    paddingTop:10,
    flexDirection:'row'
  },
  addConceptContainer: {
    width:200,
    height:200,
    borderWidth:1,
    borderColor:colorsLight.headerBorder,
    backgroundColor:colorsLight.header,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    marginRight:10,
  },
  conceptAddButtonTitle: {
    fontSize:14,
    fontFamily:'Poppins'
  },
  conceptAddButton: {
    backgroundColor:btnColors.primary,
    borderRadius:50,
    padding:5,
  },
  conceptAddButtonContainer: {
    width:'70%'
  },
  innerRow: {
    flexDirection:'row',
    marginBottom:10
  },
  taskBox: {
    width:200,
    height:200,
    borderWidth:1,
    borderColor:colorsLight.headerBorder,
    borderRadius:10,
    overflow:'hidden',
    marginRight:10
  },
  taskPreview: {
    flex:1,
  },
  taskPreviewHeader: {
    flexDirection:'row',
    alignItems:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  taskPreviewHeaderIcon: {
    padding:10,
    borderRightColor:colorsLight.headerBorder,
    borderRightWidth:1
  },
  taskPreviewTitle: {
    flex:1,
    marginLeft:10,
    fontSize:16,
    color:colorsLight.mainTextColor,
    fontFamily:'PoppinsSemiBold'
  },
  taskPreviewText: {
    fontSize:14,
    padding:10,
    color:colorsLight.mainTextColor,
    textAlign:'left',
    fontFamily:'Poppins'
  },
  taskWarningText: {
    fontSize:14,
    padding:10,
    color:btnColors.danger,
    textAlign:'center',
    fontFamily:'Poppins'
  },
  taskButtons: {
    flexDirection:'row'
  },
  taskButtonTop: {
    width:'100%',
    borderTopWidth:1,
    borderTopColor:colorsLight.headerBorder,
    padding:1,
    backgroundColor:colorsLight.header
  },
  taskButtonLeft: {
    flex:1,
    borderTopWidth:1,
    borderRightWidth:0.5,
    borderTopColor:colorsLight.headerBorder,
    borderRightColor:colorsLight.headerBorder,
    padding:10,
    backgroundColor:btnColors.info
  },
  taskButtonRight: {
    flex:1,
    borderTopWidth:1,
    borderLeftWidth:0.5,
    borderTopColor:colorsLight.headerBorder,
    borderLeftColor:colorsLight.headerBorder,
    padding:10,
    backgroundColor:btnColors.danger
  },
  taskButtonText: {
    color:'#ffffff',
    fontSize:14,
    fontFamily:'Poppins',
    textAlign:'center'
  },
  helpBox: {
    width:400,
    height:200,
    justifyContent:'center',
    alignItems:'center'
  },
  helpBoxText: {
    fontFamily:'Poppins',
    textAlign:'center',
    fontSize:14,
    color:colorsLight.mainTextColor
  },
  helpBoxError: {
    fontFamily:'PoppinsSemiBold',
    textAlign:'center',
    fontSize:14,
    color:colorsLight.mainTextColor
  },
  standardPlanText: {
    color:btnColors.success,
  },
  proPlanText: {
    color:btnColors.danger
  },
  newConceptContainer: {
    padding:20,
    borderRadius:10,
    marginBottom:20,
    backgroundColor:colorsLight.mainBackground,
  },
  newConceptHeader: {
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    paddingBottom:5,
    borderBottomWidth:1,
    borderBottomColor:colorsLight.headerBorder
  },
  newConceptDescTitle: {
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
    fontSize:24,
    paddingLeft:5,
    paddingRight:10,
  },
  newConceptBody: {
    flexDirection:'row',
    padding:10,
  },
  newConceptForm: {
    flex:3,
  },
  newConceptVideoSection: {
    flex:2,
    paddingLeft:10,
    paddingRight:10,
    marginLeft:10,
  },
  newConceptTitleLabel: {
    color:colorsLight.mainTextColor,
    fontFamily:'PoppinsSemiBold',
    fontSize:18,
  },
  inputStyle: {
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10,
    padding:10,
    width:'100%',
    fontFamily:'Poppins',
    fontSize:18,
    marginBottom:20
  },
  newConceptVideoEmpty: {
    borderRadius:10,
    borderColor:colorsLight.secondaryTextColor,
    borderWidth:1,
    borderStyle:'dashed',
    justifyContent:'center',
    alignItems:'center',
    flex:1
  },
  newConceptVideoEmptyText: {
    fontSize:16,
    fontFamily:'Poppins',
    textAlign:'center',
    color:colorsLight.secondaryTextColor
  },
  newConceptFooter: {
    flex:1,
  },
  newConceptAddButtonTitle: {
    fontSize:16,
    fontFamily:'Poppins'
  },
  newConceptAddButton: {
    backgroundColor:btnColors.primary,
    borderRadius:50,
    padding:5,
  },
  newConceptAddButtonContainer: {
    width:'60%',
    paddingLeft:10,
    paddingRight:20
  },
  showVideoOptions: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    padding:20
  },
  showVideoOptionsChooseUpload: {
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    borderColor:colorsLight.secondaryTextColor,
    borderWidth:1,
    borderStyle:'dashed',
    width:'40%',
    height:200,
    marginRight:10
  },
  showVideoOptionsChooseUploadTitle: {
    fontFamily:'Poppins',
    fontSize:16,
    textAlign:'center',
    color:colorsLight.secondaryTextColor
  },
  showVideoOptionsChooseUploadTypes: {
    fontFamily:'Poppins',
    fontSize:14,
    textAlign:'center',
    color:colorsLight.secondaryTextColor
  },
  showVideoOptionsChooseUploadSize: {
    fontFamily:'Poppins',
    fontSize:14,
    textAlign:'center',
    color:colorsLight.secondaryTextColor
  },
  showVideoOptionsChooseYouTube: {
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    borderColor:colorsLight.secondaryTextColor,
    borderWidth:1,
    borderStyle:'dashed',
    width:'40%',
    height:200,
    marginLeft:10
  },
  selectUploadContainer: {
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center',
  },
  uploadProgressTitle: {
    fontFamily:'Poppins',
    fontSize:16,
    color:colorsLight.mainTextColor,
    textAlign:'center',
    marginBottom:10,
    marginTop:20
  },
  uploadInputStyle: {
    marginBottom:10
  },
  uploadFileTitle: {
    fontSize:16,
    fontFamily:'Poppins',
  },
  uploadFileTitleButton: {
    marginTop:10,
    backgroundColor:btnColors.success,
    borderRadius:50,
    padding:10,
  },
  uploadFileTitleButtonContainer: {
    padding:5,
  },
  videoError: {
    fontSize:14,
    fontFamily:'Poppins',
    color:btnColors.danger,
    textAlign:'center'
  },
  reactPlayerContainer: {
    width:500,
    height:280,
    aspectRatio:16/9,
  },
  viewConceptBodyText: {
    fontSize:16,
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor
  },
  newConceptBodyLeft: {
    flex:1,
  },
  videoGoBack: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
    marginTop:10
  },
  videoGoBackText: {
    fontFamily:'Poppins',
    fontSize:20,
    color:colorsLight.mainTextColor
  },
  youTubeSection: {
  },
  noConceptResponses: {
    fontFamily:'Poppins',
    fontSize:18,
    color:colorsLight.mainTextColor,
    marginTop:10,
    marginLeft:5
  },
  addSurveyBody: {
    flexDirection:'row',
    marginBottom:20,
    borderLeftColor:colorsLight.headerBorder,
    borderRightColor:colorsLight.headerBorder,
    borderBottomColor:colorsLight.headerBorder,
    borderLeftWidth:1,
    borderRightWidth:1,
    borderBottomWidth:1
  },
  addSurveyListContainer: {
    flex:2,
    backgroundColor:colorsLight.header,
    borderRightWidth:1,
    borderRightColor:colorsLight.headerBorder,
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10
  },
  addSurveyListButton: {
    borderRadius:50
  },
  addSurveyListButtonContainer: {
    padding:20,
  },
  addSurveyListDropdown: {
    position:'absolute',
    width:'80%',
    backgroundColor:colorsLight.mainBackground,
    borderWidth:1,
    borderColor:colorsLight.headerBorder,
    borderRadius:10,
    padding:10,
    left:'10%',
    top:60,
  },
  addSurveyListDropdownTouch: {
    paddingLeft:10,
    paddingTop:4,
    paddingBottom:4,
    borderBottomWidth:1,
    borderBottomColor:colorsLight.headerBorder,
    cursor:'pointer'
  },
  addSurveyListDropdownTouchBottom: {
    paddingLeft:10,
    paddingTop:4,
    paddingBottom:4,
    cursor:'pointer'
  },
  addSurveyListDropdownText: {
    fontFamily:'Poppins',
    fontSize:16,
    color:colorsLight.mainTextColor
  },
  addSurveyList: {
    justifyContent:'flex-start',
    flex:5,
  },
  programTask: {
    backgroundColor:colorsLight.mainBackground,
    flexDirection:'row',
    marginBottom:10,
    borderTopColor:colorsLight.headerBorder,
    borderBottomColor:colorsLight.headerBorder,
    borderTopWidth:2,
    borderBottomWidth:2
  },
  programTaskMain: {
    flex:1,
    padding:20,
    flexDirection:'row',
    alignItems:'center',
    cursor:'pointer'
  },
  programTaskIcon: {
    marginRight:15,
  },
  programTaskTitle: {
    fontFamily:'Poppins',
    fontSize:16,
    color:colorsLight.mainTextColor
  },
  programTaskNav: {
    width:40,
    justifyContent:'space-between',
    paddingTop:4,
    paddingBottom:4
  },
  planRequiredText: {
    fontFamily:'PoppinsSemiBold',
    fontSize:12,
    color:colorsLight.mainTextColor,
  },
  addSurveyMainContainer: {
    flex:3,
    minHeight:300,
    alignItems:'center',
    justifyContent:'center',
  },
  addSurveyMainHelpText: {
    fontSize:16,
    fontFamily:'Poppins',
    textAlign:'center',
    color:colorsLight.mainTextColor
  },
  addSurveyMain: {
    flex:1,
    width:'100%',
    padding:20,
  },
  addSurveyMainHeader: {
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1,
    paddingBottom:10,
    paddingLeft:5,
    paddingRight:5,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  addSurveyMainHeaderLeft: {
    flexDirection:'row',
    flex:3,
    alignItems:'center'
  },
  addSurveyMainHeaderRight: {
    justifyContent:'center',
    flex:1,
    cursor:'pointer'
  },
  addSurveyMainHeaderDelete: {
    color:btnColors.danger,
    fontFamily:'Poppins',
    fontSize:16,
    textAlign:'right',
  },
  addSurveyMainHeaderTaskText: {
    fontFamily:'PoppinsSemiBold',
    fontSize:16,
    textAlign:'left',
    marginRight:10,
  },
  addSurveyMainHeaderTitle: {
    fontFamily:'Poppins',
    fontSize:22,
    textAlign:'left'
  },
  addSurveyMainBody: {
    paddingTop:15,
    justifyContent:'flex-start',
    alignItems:'flex-start',
  },
  addSurveyMainSearch: {
    zIndex:999
  },
  chosenTask: {
    flex:1,
    marginLeft:20,
  },
  chosenTaskTitle: {
    fontSize:22,
    marginTop:10,
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor
  },
  chosenTaskText: {
    fontSize:16,
    fontFamily:'Poppins',
    marginTop:5,
    color:colorsLight.mainTextColor
  },
  searchTaskText: {
    fontFamily:'PoppinsSemiBold',
    fontSize:14,
    color:colorsLight.mainTextColor,
  },
  addSurveyFooter: {
    flexDirection:'row',
    borderTopWidth:1,
    borderTopColor:colorsLight.headerBorder,
  },
  surveyTaskQuestion: {
    fontFamily:'Poppins',
    fontSize:12,
    color:colorsLight.mainTextColor
  },
  inputSliderInfo: {

  },
  inputSliderInfoRange: {
    flexDirection:'row',
    alignItems:'center',
    marginBottom:20
  },
  inputSliderInfoRangeSpacer: {
    padding:10,
  },
  dropdownContainer: {
    padding:5,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10
  },
  inputSliderTextContainer: {
    flexDirection:'row',
    alignItems:'center',
    marginBottom:10
  },
  inputSliderNumDisplay: {
    fontFamily:'PoppinsSemiBold',
    fontSize:20,
    color:colorsLight.mainTextColor,
    textAlign:'center',
    height:30,
    width:30,
    marginRight:10
  },
  inputSliderTextTitle: {
    fontFamily:'PoppinsSemiBold',
    fontSize:16,
    color:colorsLight.mainTextColor,
  },
  inputSliderTextLabel: {
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor,
    fontSize:14,
    borderRadius:10,
    padding:10,
    backgroundColor:colorsLight.secondaryBackground
  },
  surveyBoxes: {
    justifyContent:'flex-start',
    alignItems:'center',
    flex:1,
    marginBottom:10
  },
  boxItem: {
    flexDirection:'row',
    alignItems:'center',
    marginTop:10,
    paddingTop:15,
    marginBottom:10,
    borderTopWidth:1,
    borderTopColor:colorsLight.headerBorder
  },
  boxItemInput: {
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10,
    padding:10,
    width:'50%',
    fontFamily:'Poppins',
    fontSize:14,
  },
  boxItemNav: {
    backgroundColor:colorsLight.mainBackground,
    marginRight:10
  },
  responseRow: {
    flexDirection:'column',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1,
    backgroundColor:colorsLight.secondaryBackground
  },
  responseClientInfo: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:10,
    backgroundColor:colorsLight.header
  },
  responseClientInfoInner: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  responseClientText: {
    fontSize:18,
    color:colorsLight.mainTextColor,
    fontFamily:'Poppins',
    marginLeft:10,
  },
  responseClientCreated: {
    fontSize:16,
    color:colorsLight.mainTextColor,
    fontFamily:'Poppins',
  },
  responseTextInfo: {
    padding:5
  },
  responseText: {
    fontSize:16,
    color:colorsLight.mainTextColor,
    fontFamily:'Poppins',
  },
});

export const programsLight = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex:1,
    flexDirection:'row',

  },
  scrollView: {
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20
  },
  body: {
    flex:1,
    borderWidth:0,
  },
  bodyHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  bodyTitleGroup: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyTitle: {
    color:colorsLight.darkGray,
    fontSize:26,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodyDesc: {
    color:colorsLight.darkGray,
    fontSize:14,
    lineHeight:14,
    fontFamily:'Poppins'
  },
  bodyHeaderNav: {
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center'
  },
  bodyHeaderNavLink: {
    justifyContent:'center',
    alignItems:'center',
    fontFamily:'Poppins',
    fontSize:14
  },
  promptListContainer: {
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  promptHeader: {
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:colorsLight.headerBorder,
    justifyContent:'space-between',
    alignItems:'flex-end',
    paddingBottom:5
  },
  promptHeaderTitle: {
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
    fontSize:24,
    paddingLeft:5,
    paddingRight:10,
  },
  promptHeaderCount: {
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor,
    fontSize:16
  },
  promptsColumn: {
    paddingTop:10,
    flex:1
  },
  addPromptContainer: {
    borderWidth:1,
    flex:1,
    padding:10,
    borderColor:colorsLight.headerBorder,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
  },
  promptAddButtonTitle: {
    fontSize:14,
    fontFamily:'Poppins'
  },
  promptAddButton: {
    backgroundColor:btnColors.primary,
    borderRadius:50,
    padding:5,
  },
  promptAddButtonContainer: {
    width:150
  },
  helpBox: {
    width:400,
    height:200,
    justifyContent:'center',
    alignItems:'center'
  },
  helpBoxText: {
    fontFamily:'Poppins',
    textAlign:'center',
    fontSize:14,
    color:colorsLight.mainTextColor
  },
  helpBoxError: {
    fontFamily:'PoppinsSemiBold',
    textAlign:'center',
    fontSize:14,
    color:colorsLight.mainTextColor
  },
  standardPlanText: {
    color:btnColors.success,
  },
  proPlanText: {
    color:btnColors.danger
  }
});

export const addProgramLight = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex:1,
    flexDirection:'row',
  },
  scrollView: {
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20
  },
  body: {
    flex:1,
    borderWidth:0,
  },
  bodyHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  bodyTitleGroup: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyTitle: {
    color:colorsLight.darkGray,
    fontSize:26,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodyDesc: {
    color:colorsLight.darkGray,
    fontSize:14,
    lineHeight:14,
    fontFamily:'Poppins'
  },
  addProgramContainer: {
    backgroundColor:colorsLight.mainBackground,
    borderRadius:10,
    marginBottom:20,
  },
  addProgramHeader: {
    padding:20,
    borderBottomWidth:1,
    borderBottomColor:colorsLight.headerBorder,
  },
  addProgramLabel: {
    color:colorsLight.mainTextColor,
    fontFamily:'PoppinsSemiBold',
    fontSize:18,
  },
  inputStyle: {
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10,
    padding:10,
    width:'100%',
    fontFamily:'Poppins',
    fontSize:18,
  },
  addProgramBody: {
    flexDirection:'row'
  },
  addProgramListContainer: {
    flex:2,
    backgroundColor:colorsLight.header,
    borderRightWidth:1,
    borderRightColor:colorsLight.headerBorder,
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10
  },
  addProgramListButton: {
    borderRadius:50
  },
  addProgramListButtonContainer: {
    padding:20,
  },
  addProgramListDropdown: {
    position:'absolute',
    width:'80%',
    backgroundColor:colorsLight.mainBackground,
    borderWidth:1,
    borderColor:colorsLight.headerBorder,
    borderRadius:10,
    padding:10,
    left:'10%',
    top:60,
  },
  addProgramListDropdownTouch: {
    paddingLeft:10,
    paddingTop:4,
    paddingBottom:4,
    borderBottomWidth:1,
    borderBottomColor:colorsLight.headerBorder,
    cursor:'pointer'
  },
  addProgramListDropdownTouchBottom: {
    paddingLeft:10,
    paddingTop:4,
    paddingBottom:4,
    cursor:'pointer'
  },
  addProgramListDropdownText: {
    fontFamily:'Poppins',
    fontSize:16,
    color:colorsLight.mainTextColor
  },
  addProgramList: {
    justifyContent:'flex-start',
    flex:5,
  },
  programTask: {
    backgroundColor:colorsLight.mainBackground,
    flexDirection:'row',
    marginBottom:10,
    borderTopColor:colorsLight.headerBorder,
    borderBottomColor:colorsLight.headerBorder,
    borderTopWidth:2,
    borderBottomWidth:2
  },
  programTaskMain: {
    flex:1,
    padding:20,
    flexDirection:'row',
    alignItems:'center',
    cursor:'pointer'
  },
  programTaskIcon: {
    marginRight:15,
  },
  programTaskTitle: {
    fontFamily:'Poppins',
    fontSize:16,
    color:colorsLight.mainTextColor
  },
  programTaskNav: {
    width:40,
    justifyContent:'space-between',
    paddingTop:4,
    paddingBottom:4
  },
  planRequiredText: {
    fontFamily:'PoppinsSemiBold',
    fontSize:12,
    color:colorsLight.mainTextColor,
  },
  addProgramMainContainer: {
    flex:3,
    minHeight:300,
    alignItems:'center',
    justifyContent:'center',
  },
  addProgramMainHelpText: {
    fontSize:16,
    fontFamily:'Poppins',
    textAlign:'center',
    color:colorsLight.mainTextColor
  },
  addProgramMain: {
    flex:1,
    width:'100%',
    padding:20,
  },
  addProgramMainHeader: {
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1,
    paddingBottom:10,
    paddingLeft:5,
    paddingRight:5,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  addProgramMainHeaderLeft: {
    flexDirection:'row',
    flex:3,
    alignItems:'center'
  },
  addProgramMainHeaderRight: {
    justifyContent:'center',
    flex:1,
    cursor:'pointer'
  },
  addProgramMainHeaderDelete: {
    color:btnColors.danger,
    fontFamily:'Poppins',
    fontSize:16,
    textAlign:'right',
  },
  addProgramMainHeaderTaskText: {
    fontFamily:'PoppinsSemiBold',
    fontSize:16,
    textAlign:'left',
    marginRight:10,
  },
  addProgramMainHeaderTitle: {
    fontFamily:'Poppins',
    fontSize:22,
    textAlign:'left'
  },
  addProgramMainBody: {
    paddingTop:15,
    justifyContent:'flex-start',
    alignItems:'flex-start',
  },
  addProgramMainSearch: {
    zIndex:999
  },
  chosenTask: {
    flex:1,
    marginLeft:20,
  },
  chosenTaskTitle: {
    fontSize:22,
    marginTop:10,
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor
  },
  chosenTaskText: {
    fontSize:16,
    fontFamily:'Poppins',
    marginTop:5,
    color:colorsLight.mainTextColor
  },
  searchTaskText: {
    fontFamily:'PoppinsSemiBold',
    fontSize:14,
    color:colorsLight.mainTextColor,
  },
  addProgramFooter: {
    flexDirection:'row',
    borderTopWidth:1,
    borderTopColor:colorsLight.headerBorder,
  },
})

export const brandDesignLight = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex:1,
    flexDirection:'row',
  },
  scrollView: {
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20,
  },
  body: {
    flex:1,
    borderWidth:0,
  },
  bodyHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  bodyTitleGroup: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyTitle: {
    color:colorsLight.darkGray,
    fontSize:26,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodyDesc: {
    color:colorsLight.darkGray,
    fontSize:14,
    lineHeight:14,
    fontFamily:'Poppins'
  },
  brandContainer: {
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  brandColoringRow: {
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'flex-end',
  },
  brandColoringGroup: {
    flex:1,
    justifyContent:'center'
  },
  brandColoringGroupTitle: {
    fontFamily:'PoppinsSemiBold',
    fontSize:18,
    color:colorsLight.mainTextColor,
    textAlign:'center',
    marginBottom:20
  },
  brandColoringTouch: {
    borderRadius:10,
    height:30,
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  sectionTitle: {
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
    fontSize:24,
  },
  sectionContent: {
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor,
    fontSize:16,
    marginBottom:20
  },
  saveColoringText: {
    fontSize:14,
    fontFamily:'Poppins'
  },
  saveColoringButton: {
    backgroundColor:btnColors.primary,
    borderRadius:50,
    padding:5,
  },
  saveColoringContainer: {
    width:'100%'
  },
  testAccLabel: {
    fontFamily:'PoppinsSemiBold',
    fontSize:16,
    width:'100%',
    textAlign:'center',
    color:'#000'
  },
  logoUploadPreview: {
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    borderColor:colorsLight.secondaryTextColor,
    borderWidth:1,
    borderStyle:'dashed',
    width:200,
    height:200
  },
  logoBelow: {
    fontSize:14,
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor,
    textAlign:'center'
  },
  errorText: {
    fontSize:14,
    fontFamily:'Poppins',
    color:btnColors.danger,
    textAlign:'center'
  },
  resetToDefault: {
    fontSize:14,
    fontFamily:'Poppins',
    color:btnColors.primary,
    textAlign:'center'
  },
  brandHeaderRow: {
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  headerInputStyle: {
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10,
    padding:10,
    height:38,
    width:'100%',
    fontFamily:'Poppins',
    fontSize:18,
    marginBottom:10,
    textAlign:'center'
  },
})

export const allClientsLight = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex:1,
    flexDirection:'row',
  },
  scrollView: {
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20
  },
  body: {
    flex:1,
    borderWidth:0,
  },
  bodyHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  bodyTitleGroup: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyTitle: {
    color:colorsLight.darkGray,
    fontSize:26,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodyDesc: {
    color:colorsLight.darkGray,
    fontSize:14,
    lineHeight:14,
    fontFamily:'Poppins'
  },
})

export const inviteClientsLight = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex:1,
    flexDirection:'row',
  },
  scrollView: {
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20
  },
  body: {
    flex:1,
    borderWidth:0,
  },
  bodyHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  bodyTitleGroup: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyTitle: {
    color:colorsLight.darkGray,
    fontSize:26,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodySubtitle: {
    color:colorsLight.darkGray,
    fontSize:20,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodyDesc: {
    color:colorsLight.darkGray,
    fontSize:14,
    lineHeight:14,
    fontFamily:'Poppins'
  },
  bodyContainer: {
    backgroundColor:colorsLight.mainBackground,
    borderRadius:10,
    padding:20,
    marginBottom:20
  },
  inputTitle: {
    color:colorsLight.mainTextColor,
    fontFamily:'PoppinsSemiBold',
    fontSize:18,
  },
  inputStyle: {
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10,
    padding:10,
    width:'100%',
    fontFamily:'Poppins',
    fontSize:18,
    marginBottom:20
  },
  bodyRow: {
    flexDirection:'row',
    alignItems:'flex-start',
  },
  bodyInputContainer: {
    flex:1,
    justifyContent:'center',
    paddingRight:20
  },
  saveText: {
    fontSize:14,
    fontFamily:'Poppins'
  },
  saveButton: {
    backgroundColor:btnColors.primary,
    borderRadius:50,
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:10,
    paddingRight:10
  },
  saveContainer: {
    flex:1,
  },
  saveContainerRow: {
    flexDirection:'row',
    alignItems:'flex-end'
  },
  saveContainerSpacer: {
    flex:3
  },
  coachID: {
    color:colorsLight.mainBackground,
    backgroundColor:colorsLight.mainTextColor,
    padding:10,
    borderRadius:10,
    fontSize:24,
    fontFamily:'PoppinsSemiBold',
    textAlign:'center'
  }
})

export const integrationsLight = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex:1,
    flexDirection:'row',
  },
  scrollView: {
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20
  },
  body: {
    flex:1,
    borderWidth:0,
  },
  bodyHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  bodyTitleGroup: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyTitle: {
    color:colorsLight.darkGray,
    fontSize:26,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodySubtitle: {
    color:colorsLight.darkGray,
    fontSize:20,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodyDesc: {
    color:colorsLight.darkGray,
    fontSize:14,
    lineHeight:14,
    fontFamily:'Poppins'
  },
  bodyContainer: {
    backgroundColor:colorsLight.mainBackground,
    borderRadius:10,
    padding:20,
    marginBottom:20
  },
  inputTitle: {
    color:colorsLight.mainTextColor,
    fontFamily:'PoppinsSemiBold',
    fontSize:18,
  },
  inputStyle: {
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10,
    padding:10,
    width:'100%',
    fontFamily:'Poppins',
    fontSize:18,
    marginBottom:20
  },
  saveColoringText: {
    fontSize:14,
    fontFamily:'Poppins'
  },
  saveColoringButton: {
    backgroundColor:btnColors.primary,
    borderRadius:50,
    padding:5,
  },
  saveColoringContainer: {
    width:'25%',
    marginLeft:'75%'
  },
  bodyRow: {
    flexDirection:'row',
    alignItems:'flex-start',
  },
  bodyInputContainer: {
    flex:1,
    justifyContent:'center',
    paddingRight:20
  },
  saveText: {
    fontSize:14,
    fontFamily:'Poppins'
  },
  saveButton: {
    backgroundColor:btnColors.primary,
    borderRadius:50,
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:10,
    paddingRight:10
  },
  saveContainer: {
    flex:1,
  },
  saveContainerRow: {
    flexDirection:'row',
    alignItems:'flex-end'
  },
  saveContainerSpacer: {
    flex:3
  },
  coachID: {
    color:colorsLight.mainBackground,
    backgroundColor:colorsLight.mainTextColor,
    padding:10,
    borderRadius:10,
    fontSize:24,
    fontFamily:'PoppinsSemiBold',
    textAlign:'center'
  },
  stripeConnected: {
    fontSize:16,
    padding:5,
    borderRadius:10,
    marginTop:10,
    borderWidth:1,
    borderColor:btnColors.success,
    color:btnColors.success,
    fontFamily:'Poppins'
  }
})

export const paymentsLight = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex:1,
    flexDirection:'row',
  },
  scrollView: {
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20
  },
  body: {
    flex:1,
    borderWidth:0,
  },
  bodyHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  bodyTitleGroup: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyTitle: {
    color:colorsLight.darkGray,
    fontSize:26,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodySubtitle: {
    color:colorsLight.darkGray,
    fontSize:20,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodyDesc: {
    color:colorsLight.darkGray,
    fontSize:14,
    lineHeight:14,
    fontFamily:'Poppins'
  },
  bodyContainer: {
    backgroundColor:colorsLight.mainBackground,
    borderRadius:10,
    padding:20,
    marginBottom:20
  },
  inputTitle: {
    color:colorsLight.mainTextColor,
    fontFamily:'PoppinsSemiBold',
    fontSize:18,
  },
  inputStyle: {
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10,
    padding:10,
    width:'100%',
    fontFamily:'Poppins',
    fontSize:18,
    marginBottom:20
  },
  bodyRow: {
    flexDirection:'row',
    alignItems:'center',
  },
  bodyInputContainer: {
    flex:1,
    justifyContent:'center',
    paddingRight:20
  },
  saveText: {
    fontSize:14,
    fontFamily:'Poppins'
  },
  saveButton: {
    backgroundColor:btnColors.primary,
    borderRadius:50,
    padding:5,
  },
  saveContainer: {
    flex:1,
  },
  saveContainerRow: {
    flexDirection:'row',
    alignItems:'flex-end'
  },
  saveContainerSpacer: {
    flex:3
  },
  paymentsControls: {
    flexDirection:'row',
    alignItems:'center'
  },
  paymentsControlsText: {
    padding:10,
    fontFamily:'PoppinsSemiBold',
    fontSize:14,
    color:colorsLight.secondaryTextColor,
    width:'100%'
  },
  paymentControlsTouchIcon: {
    height:40,
    width:40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentControlsTouchAmount: {
    flex:8,
    height:40,
    alignItems:'flex-end',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentControlsTouchAmountCurrency: {
    flex:6,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentControlsTouchAmountStatus: {
    flex:12,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentControlsTouchDescription: {
    flex:45,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentControlsTouchClient: {
    flex:22,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentControlsTouchDate: {
    flex:25,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentRow: {
    flexDirection:'row',
    alignItems:'center'
  },
  paymentRowText: {
    padding:10,
    fontFamily:'Poppins',
    fontSize:14,
    color:colorsLight.mainTextColor,
    width:'100%'
  },
  paymentRowTouchIcon: {
    height:40,
    width:40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentRowTouchAmount: {
    flex:8,
    height:40,
    alignItems:'flex-end',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentRowTouchAmountCurrency: {
    flex:6,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentRowTouchAmountStatus: {
    flex:12,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentRowTouchDescription: {
    flex:45,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentRowTouchClient: {
    flex:22,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  paymentRowTouchDate: {
    flex:25,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:colorsLight.headerBorder,
    borderBottomWidth:1
  },
  noPayments: {
    width:'100%',
    padding:10,
    textAlign:'center',
    fontSize:16,
    fontFamily:'Poppins',
    color:colorsLight.mainTextColor
  }
})

export const managePlanLight = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex:1,
    flexDirection:'row',
  },
  scrollView: {
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20
  },
  body: {
    flex:1,
    borderWidth:0,
  },
  bodyHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  bodyTitleGroup: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyTitle: {
    color:colorsLight.darkGray,
    fontSize:26,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodySubtitle: {
    color:colorsLight.darkGray,
    fontSize:20,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodyDesc: {
    color:colorsLight.darkGray,
    fontSize:16,
    lineHeight:18,
    fontFamily:'Poppins'
  },
  bodyContainer: {
    backgroundColor:colorsLight.mainBackground,
    borderRadius:10,
    padding:20,
    marginBottom:20
  },
  currentEmail: {
    fontSize:20,
    padding:10,
    borderRadius:10,
    color:colorsLight.mainBackground,
    backgroundColor:colorsLight.mainTextColor,
    fontFamily:'Poppins',
    width:'25%',
    textAlign:'center'
  },
  inputTitle: {
    color:colorsLight.mainTextColor,
    fontFamily:'PoppinsSemiBold',
    fontSize:18,
  },
  inputStyle: {
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10,
    padding:10,
    width:'100%',
    fontFamily:'Poppins',
    fontSize:18,
    marginBottom:20
  },
  bodyRow: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyInputContainer: {
    flex:1,
    justifyContent:'center',
    paddingRight:20
  },
  saveText: {
    fontSize:14,
    fontFamily:'Poppins'
  },
  saveButton: {
    backgroundColor:btnColors.primary,
    borderRadius:50,
    padding:5,
  },
  saveContainer: {
    flex:1,
  },
  saveContainerRow: {
    flexDirection:'row',
    alignItems:'flex-end'
  },
  saveContainerSpacer: {
    flex:3
  },
  passwordPromptError: {
    textAlign:'center',
    fontSize:16,
    color:btnColors.danger,
    fontFamily:'Poppins',
  },
  changeEmailSent: {
    flex:3,
    marginLeft:20,
    color:btnColors.success,
    fontSize:18,
    fontFamily:'Poppins'
  },
  inputHeader: {
    fontSize:16,
    padding:5,
    color:colorsLight.secondaryTextColor,
    fontFamily:'PoppinsSemiBold',
  },
  managePaymentsButton: {
    padding:10,
    borderWidth:1,
    borderColor:btnColors.primary,
    borderRadius:10,
    backgroundColor:btnColors.lightBackground,
    color:btnColors.primary,
  },
  managePaymentsButtonContainer: {
    width:'50%',
    marginLeft:5,
    marginTop:10
  },
  barSelected: {
    padding:10,
    marginRight:10,
    backgroundColor:btnColors.primary,
    color:'#fff',
    fontFamily:'Poppins',
    fontSize:16,
    borderRadius:10,
  },
  barUnselected: {
    padding:10,
    marginRight:10,
    color:btnColors.primary,
    fontFamily:'Poppins',
    fontSize:16
  },
  planCurrency: {
    fontSize:24,
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
    padding:5,
    marginTop:-8
  },
  planAmount: {
    fontSize:40,
    fontFamily:'PoppinsSemiBold',
    color:colorsLight.mainTextColor,
    marginTop:-10
  },
  planDuration: {
    fontSize:16,
    fontFamily:'Poppins',
    color:colorsLight.secondaryTextColor,
    paddingTop:2,
    paddingLeft:10
  },
  upgradePlanButton: {
    padding:10,
    borderWidth:1,
    borderColor:btnColors.primary,
    borderRadius:10,
    backgroundColor:btnColors.primary,
  },
  upgradePlanButtonContainer: {
    width:'30%',
    marginTop:8
  }
})

export const accountLight = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex:1,
    flexDirection:'row',
  },
  scrollView: {
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20
  },
  body: {
    flex:1,
    borderWidth:0,
  },
  bodyHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  bodyTitleGroup: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyTitle: {
    color:colorsLight.darkGray,
    fontSize:26,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodySubtitle: {
    color:colorsLight.darkGray,
    fontSize:20,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodyDesc: {
    color:colorsLight.darkGray,
    fontSize:14,
    lineHeight:14,
    fontFamily:'Poppins'
  },
  bodyContainer: {
    backgroundColor:colorsLight.mainBackground,
    borderRadius:10,
    padding:20,
    marginBottom:20
  },
  currentEmail: {
    fontSize:20,
    padding:10,
    borderRadius:10,
    color:colorsLight.mainBackground,
    backgroundColor:colorsLight.mainTextColor,
    fontFamily:'Poppins',
    width:'25%',
    textAlign:'center'
  },
  inputTitle: {
    color:colorsLight.mainTextColor,
    fontFamily:'PoppinsSemiBold',
    fontSize:18,
  },
  inputStyle: {
    color:colorsLight.mainTextColor,
    backgroundColor:colorsLight.secondaryBackground,
    borderRadius:10,
    padding:10,
    width:'100%',
    fontFamily:'Poppins',
    fontSize:18,
    marginBottom:20
  },
  bodyRow: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyInputContainer: {
    flex:1,
    justifyContent:'center',
    paddingRight:20
  },
  saveText: {
    fontSize:14,
    fontFamily:'Poppins'
  },
  saveButton: {
    backgroundColor:btnColors.primary,
    borderRadius:50,
    padding:5,
  },
  saveContainer: {
    flex:1,
  },
  saveContainerRow: {
    flexDirection:'row',
    alignItems:'flex-end'
  },
  saveContainerSpacer: {
    flex:3
  },
  passwordPromptError: {
    textAlign:'center',
    fontSize:16,
    color:btnColors.danger,
    fontFamily:'Poppins',
  },
  changeEmailSent: {
    flex:3,
    marginLeft:20,
    color:btnColors.success,
    fontSize:18,
    fontFamily:'Poppins'
  },
  inputHeader: {
    fontSize:16,
    padding:5,
    color:colorsLight.secondaryTextColor,
    fontFamily:'PoppinsSemiBold',
  }
})

export const socialFeedLight = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex:1,
    flexDirection:'row',
  },
  scrollView: {
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20
  },
  body: {
    flex:1,
    borderWidth:0,
  },
  bodyHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    borderRadius:10,
    backgroundColor:colorsLight.mainBackground,
    marginBottom:20,
  },
  bodyTitleGroup: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  bodyTitle: {
    color:colorsLight.darkGray,
    fontSize:26,
    marginRight:10,
    fontFamily:'PoppinsSemiBold'
  },
  bodyDesc: {
    color:colorsLight.darkGray,
    fontSize:14,
    lineHeight:14,
    fontFamily:'Poppins'
  },
})
