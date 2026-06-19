const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const QRCode = require('qrcode');
const {adminModel} = require("../models/index");
const injector = require('../functions/index');

const loginVerify = async(loginData) => {
  try{
    let p = 0;
    let m = 0;
    let matchedIndex = -1;
    let uid = 0;
        const token = jwt.sign( { memberId: loginData.username },process.env.JWT_SECRET,{ expiresIn: '1d' });
        const adminResult = await adminModel.adminDetail(); 
        const cleanPassword = String(loginData.password).replace(/[\r\n\t]/g, '').trim();
        for(let i=0;i<adminResult.length;i++){
            if(adminResult[i].admin_username == loginData.username ){
                {
                    p = 1;      

                    if(await bcrypt.compare(cleanPassword, adminResult[i].admin_password) ){  
                        m = 1;
                        matchedIndex = i;
                        uid = adminResult[i].admin_uid;
                        break;
                    }
                }
            }
        }
        if(p === 1 )
        {
            if(m === 1 && matchedIndex !== -1){
                const verifyData = await adminModel.verifyLogin({ username: loginData.username,token:token});
                if(verifyData.success == true)
                    return { success: true,uid:uid,token:token,message: "You have logged in successfully"};
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

const getQrCode = async(memberData) => {
  try{
        const participantData = await adminModel.getQrCod({register_id:memberData});
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
            return  {success: true,message: "Register request approved"};
          }else{
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
    getQrCode,
    logoutSession
}
