
const eventModel = require('../models/event');
const crypto = require('crypto');
const injector = require('../functions');
const jwt = require('jsonwebtoken');

const loginMember = async(loginData) => {
  try{
    const otp = crypto.randomInt(100000, 999999);
    const loginDatas = await eventModel.checkEmail({otp:otp, email_id: loginData.email});
    return  loginDatas;
  }
  catch(error){
    return error;
  }  
}

const otp = async(loginData) => {
  try{
    const loginDatas = await eventModel.getOtp({email_id: loginData});
    return  loginDatas;
  }
  catch(error){
    return error;
  }  
}

const loginOtpVerify = async(loginData) => {
  try{
        const token = jwt.sign( { memberId: loginData.email },process.env.JWT_SECRET,{ expiresIn: '1d' });
        const verifyData = await eventModel.verifyOtp({otp:loginData.otp, email_id: loginData.email,token:token});
        return  verifyData.length > 0 ? verifyData.map(data => ({...data,token: token})) : verifyData;
    }
  catch(error){
    return error;
  }  
}

const getRegisterData = async(uid,token) => {
  try{
    const verifyData = await eventModel.getQr({uid:uid,token:token});
    return  verifyData;
  }
  catch(error){
    return error;
  }  
}


const logoutSession = async(logoutData) => {
  try{
    const verifyData = await eventModel.logout({uid: logoutData.uid});
    return  verifyData;
  }
  catch(error){
    return error;
  }  
}

module.exports = {
  otp,
    loginMember,
    loginOtpVerify,
    getRegisterData,
    logoutSession
}