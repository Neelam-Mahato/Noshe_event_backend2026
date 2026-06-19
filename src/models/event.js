  
  const db = require('../config/db'); 

  const RegisterMember= async (payload) => {
    try{ 
    const queryValues = [ payload.name, payload.email_id, payload.mobile_no,payload.organisation,payload.designation,payload.delegate_type,payload.city,payload.dietary, payload.message , 0, 0];
    const query = `INSERT INTO registered_members( name, email_id, mobile_no, organisation, designation, delegate_type, city, dietary, message , register_status,attendance) VALUES (?,?,?,?, ?, ?, ? ,? , ?, ?, ?)`;
    const [result] = await db.execute(query, queryValues);
    
    if (result.affectedRows === 0) {
      throw new Error('Member registration failed');
    }
    else
        return result.insertId; 
     } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
  }

  const checkRegisteredMember= async (payload) => {
    try{ 
    const query = `Select * from registered_members`;
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

  const getMembers= async (payload) => {
    try{ 
    const query = `Select * from members`;
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
  
    const generateAttendance= async (payload) => {
    try{ 
          const queryValues = [payload.uid];

          const query = `SELECT * from registered_members where uid=?`;
          const [result] = await db.execute(query,queryValues);
          console.log(result)
         if(result.length == 0){
          return {success:"false", message:"Not a registered member"}
         }
         else if(result.length == 1){
           console.log(result[0].attendance);
          if(result[0].attendance === 1){
            return {success:"false", message:"Already scanned and attendance marked"}
          }
          else if(result[0].attendance === 0){
              const queryParam = [1, payload.uid];
              const query = `Update registered_members Set attendance = ? where uid = ?`;
              await db.execute(query,queryParam);
              return {success:"true", message:"Attendance marked succesfully"}
          }
         }
     } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
  }


  const checkEmail= async (payload) => {
    try{ 
      const param = [payload.email_id]
    const query = `Select * from registered_members where email_id = ?`;
    const [result] = await db.execute(query, param);

    if(result.length > 0){
      const params = [payload.otp,payload.email_id];
      const query = `Update registered_members Set loginotp = ? where email_id = ?`;
      await db.execute(query, params);
      return {success:true, message:"Otp send successfully.Check your email."}
    }
    else if(result.length == 0){
      return {success:false, message:"Not a registered member"} 
    }
     } catch (error) {
    console.error(' Error:', error);

    return {
      success: false,
      error: error.message
    };
  }
  }

  const verifyOtp= async (payload) => {
    try{ 
      const param = [payload.email_id,payload.otp];
      const query = `Select uid, name, email_id, mobile_no, message, registered_date, token, qr_code from registered_members where email_id = ? and loginotp = ?`;
      const [result] = await db.execute(query, param);
      if(result.length > 0){
        const param = [0, payload.token, payload.email_id];
        const query = `Update registered_members set loginotp = ? ,token = ? where email_id = ? `;
        await db.execute(query, param);
        return result; 
      }
      else
        return {success:false,msg:1}
    
     } catch (error) {
    console.error(' Error:', error);

    return {
      success: false,
      error: error.message
    };
  }
  }

  const getQr= async (payload) => {
    try{ 
      console.log(payload)
      const param = [payload.uid,payload.token];
      const query = `Select uid, name, mobile_no,qr_code from registered_members where uid = ? and token = ?`;
      const [result] = await db.execute(query, param);
      return result; 
    
     } catch (error) {
    console.error(' Error:', error);

    return {
      success: false,
      error: error.message
    };
  }
  }

   const getOtp= async (payload) => {
    try{ 
      console.log(payload)
      const param = [payload.email_id];
      const query = `Select loginotp,name from registered_members where email_id = ?`;
      const [result] = await db.execute(query, param);
      return result; 
    
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
      const query = `Update registered_members Set token = ? where uid = ?`;
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
    RegisterMember,
    checkRegisteredMember,
    getMembers,
    generateAttendance,
    checkEmail,
    verifyOtp,
    getQr,
    getOtp,
    logout
};
