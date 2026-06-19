const { loginService } = require('../services');
const injector = require('../functions/index');

const loginOtp = async(req,res) =>{
    try{
        const loginData = req.body;
        const loginResult = await loginService.loginMember(loginData);
        console.log(loginResult)
        if(loginResult.success == false)
            res.status(500).json({ success: false, message: loginResult.message });
        else{
                res.status(200).json({ success: true, message: loginResult.message });
                await injector.sendOtp(otp,loginData.email);
        }

    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to login' });
    }
}

const login = async(req,res) =>{
    try{
        const otpVerify = req.body;
        const verifyResult = await loginService.loginOtpVerify(otpVerify);
        if(verifyResult.length > 0)
            return res.status(200).json({ success: true, message: "Logged In Successfully", data: verifyResult });
        else  {
            if(verifyResult?.success == false && verifyResult.msg == 1){
                return res.status(500).json({ success: false, message: "Wrong OTP entered." });
            }
            else
                return res.status(500).json({ success: false, message: "Some error occured" });
        }
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to login' });
    }
}

const memberDetails = async(req,res) =>{
    try{
        const result = await loginService.getRegisterData(req.body.uid,req.headers.authorization);
        if(result.length > 0)
            return res.status(200).json({ success: true, data: result}); 
        else
            return res.status(500).json({ success: false, message:"Token Expired. Please login again"}); 

    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to login' });
    }
}

const logout = async(req,res) =>{
    try{
        const param = req.body;
        const result = await loginService.logoutSession(param);
        if(result.success == true)
            return res.status(200).json({ success: true, message: "Logged out succesfully"}); 
        else
            return res.status(500).json({ success: true, message: "Some error occured"}); 
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to login' });
    }
}

module.exports = {
    loginOtp, 
    login,
    memberDetails,
    logout
}