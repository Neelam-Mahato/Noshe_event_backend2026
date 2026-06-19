const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const QRCode = require('qrcode');
const {adminModel} = require("../models/index");
const injector = require('../functions/index');

const loginVerify = async(loginData) => {
  try{
        const token = jwt.sign( { memberId: loginData.username },process.env.JWT_SECRET,{ expiresIn: '1d' });
        const adminResult = await adminModel.adminDetail(); 
        if(adminResult[0].admin_username == loginData.username )
        {
            if(await bcrypt.compare(loginData.password, adminResult[0].admin_password)){
                const verifyData = await adminModel.verifyLogin({password:loginData.password, username: loginData.username,token:token});
                if(verifyData.success == true)
                    return { success: true,uid:adminResult[0].admin_uid,token:token,message: "You have logged in successfully"};
                else
                    return { success: false,message: "Some error occurred"};
            }
            else
                return { success: false,message: "You have entered wrong password.Please rectify"};
        }
        else
            return { success: false,message: "You have entered wrong username.Please rectify"};
    }
    catch(error){
        return error;
  }  
}

const getParticipantData = async(participantsData) => {
  try{
        const participantData = await adminModel.getParticipants({token:participantsData});
        return  participantData;
    }
    catch(error){
        return error;
    }  
}

const waitingMember = async(memberData) => {
  try{
        const participantData = await adminModel.getWaitingMembers({token:memberData});
        return  participantData;
    }
    catch(error){
        return error;
    }  
}

const manageRegistration = async(header, body) => {
  try{
        let generatedQr = null;
        let qrToken = null;
        if(body.register_status == 1){
            const { randomUUID } = require('crypto');
            qrToken = randomUUID();
            const qrPayload = qrToken;
            generatedQr = await QRCode.toDataURL(qrPayload);
        } else {
            qrToken = null;
            generatedQr = null;
        }
        const participantData = await adminModel.manageRegistration({register_status:body.register_status, register_id:body.register_id,uid:qrToken,qr_code:generatedQr});
        console.log("service",participantData)
        if(participantData.success == true ){
          if( body.register_status == 1){
            await injector.sendQrEmail(body.email, body.name, generatedQr); 
            return  {success: true,message: "Register request approved"};
          }else{
            await injector.sendEmail(body.email, body.name); 
            return  {success: true,message: "Register request declined"};
        }
        }
        else {
            return  {success: false}; 
        }
    }
    catch(error){
      console.log(error);
      return {
        success: false,
        message: error.message
      };
  }  
}

const logoutSession = async(logoutData) => {
  try{
        const verifyData = await adminModel.logout({uid: logoutData.uid});
        return  verifyData;
    }
    catch(error){
        return error;
  }  
}

module.exports = {
    loginVerify,
    getParticipantData,
    waitingMember,
    manageRegistration,
    logoutSession
}
