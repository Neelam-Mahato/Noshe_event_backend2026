const db = require("../config/db");

  const adminDetail= async () => {
    try{ 
      const query = `Select * from admin`;
      const [result] = await db.execute(query);
      return result; 
    
     } catch (error) {
    console.error(' Error:', error);

    return {
      success: false,
      error: error.message
    };
  }
  }

  const verifyLogin= async (payload) => {
    try{ 
      const param = [payload.token, payload.username];
      const query = `Update admin set admin_token = ? where admin_username = ? `;
      const [result] = await db.execute(query, param);
      return result.affectedRows == 1 ? {success:true} : {success: false}; 
     } catch (error) {
    console.error(' Error:', error);

    return {
      success: false,
      error: error.message
    };
  }
  }

  const getParticipants= async (payload) => {
    try{ 
      const param = [payload.token];
      const query1 = `Select admin_token from admin `;
      const [result1] = await db.execute(query1);
      const query = `Select admin_token from admin where admin_token = ?`;
      const [result] = await db.execute(query,param);
       if(result1.length > 0 && result.length == 0 ){
        return {success:false,msg:1} 
      }
      if(result[0].admin_token == null || result[0].admin_token == "" || result[0].admin_token == 'null'){
        return {success:false ,msg:2} 
      }
      else
      {
        const query = `SELECT (SELECT JSON_ARRAYAGG(JSON_OBJECT('name', name,'email_id', email_id,'mobile_no', mobile_no,'registered_date',registered_date)) FROM registered_members WHERE register_status = 1) AS participants,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('name', name,'email_id', email_id,'mobile_no', mobile_no,'registered_date',registered_date)) FROM registered_members WHERE register_status = 1 and attendance = 1) AS checkedIn;`;
        const [result1] = await db.execute(query);
        return result1;
      }
      
    
     } catch (error) {
    console.error(' Error:', error);

    return {
      success: false,
      error: error.message
    };
  }
  }

  const getWaitingMembers= async (payload) => {
    try{ 
        const param = [0];
        const query = `SELECT  register_id, name, email_id, mobile_no,creation_date FROM registered_members WHERE register_status = ?`;
        console.log(query)
        const [result1] = await db.execute(query, param);
        console.log(query)
        return result1;
     } catch (error) {
    console.error(' Error:', error);

    return {
      success: false,
      error: error.message
    };
  }
  }

  
  const getQrCod= async (payload) => {
    try{ 
        const param = [payload.register_id];
        const query = `SELECT qr_code FROM registered_members WHERE register_id= ?`;
        console.log(query)
        const [result1] = await db.execute(query, param);
        console.log(query)
        return result1[0].qr_code;
     } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
  }
   const manageRegistration= async (payload) => {
    try{       
        const params = [payload.register_status, payload.uid,payload.qr_code, payload.register_id];
        const query = `Update registered_members set register_status = ? , uid = ?, qr_code = ? where register_id = ?`;
        const [result1] = await db.execute(query,params);
        console.log(result1.affectedRows)
        return result1.affectedRows == 1 ? {success:true} : {success: false}; 
      
    
     } catch (error) {
    console.error(' Error:', error);

    return {
      success: false,
      error: error.message
    };
  }
  }
  
  const logout= async (payload) => {
    try{ 
      const param = [null, payload.uid];
      const query = `Update admin Set admin_token = ? where admin_uid = ?`;
      const [result] = await db.execute(query, param);
      return result.affectedRows == 1 ? {success:true} : {success: false}; 
    
     } catch (error) {
    console.error(' Error:', error);

    return {
      success: false,
      error: error.message
    };
  }
  }

  module.exports = {
    adminDetail,
    verifyLogin,
    getWaitingMembers,
    manageRegistration,
    getParticipants,
    getQrCod,
    logout
};
