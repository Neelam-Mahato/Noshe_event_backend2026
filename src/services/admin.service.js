const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const {adminModel} = require("../models/index");

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
        if(body.aproval_status == 1){
            const { randomUUID } = require('crypto');
            qrToken = randomUUID();
            const qrPayload = qrToken;
            generatedQr = await QRCode.toDataURL(qrPayload);
        } else {
            qrToken = null;
            generatedQr = null;
        }
        const participantData = await adminModel.manageRegistration({token:header,register_status:body.aproval_status, register_id:body.id,uid:qrToken,qr_code:generatedQr});
        if(participantData){
            await injector.sendQrEmail(participantData.email, participantData.name, generatedQr); 
        }
        return  participantData;
    }
    catch(error){
        return error;
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
