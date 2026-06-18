const QRCode = require('qrcode');
const EventModel = require('../models/event');
const injector = require('../functions/index');
// const { randomUUID } = require('crypto');
// const qrToken = randomUUID();

const registerService = async(registerData) => {
  try{
    console.log(registerData);
     const { fullName, phone, email, message, organisation, designation, delegateType, city, dietary } = registerData;
    var check = 0;
    const members = await EventModel.getMembers();

    for(var i = 0; i<members.length;i++){
      if(members[i].email_id == email || members[i].mobile_no == phone){
        check = 1;
        break;
      }    
    }
    if(check == 1){
      check = 0;
      const checkRegistration = await EventModel.checkRegisteredMember();
      for(var j = 0; j<checkRegistration.length;j++){
        if(checkRegistration[j].email_id == email && checkRegistration[j].mobile_no == phone){
          check = 1;
          break;
        }
      }    
      if(check == 1)
      {
        return {msg : 4}
      }
      else
      {
        const newRegister = await EventModel.RegisterMember({name: fullName, mobile_no: phone, email_id:email, message:message
          , organisation:organisation,designation:designation,delegate_type:delegateType,city:city,dietary:dietary });
        
        return { fullName, phone, email ,msg:1};
      } 
  }
  else
    return {msg : 0}
  }
   catch(error){
        return {msg : 2 }
   }
   
}


module.exports = {
    registerService
}
