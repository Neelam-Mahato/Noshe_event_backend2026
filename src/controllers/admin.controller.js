const { adminService } = require('../services');

const login = async(req,res) =>{
    try{
        const loginDetail = req.body;
        const loginResult = await adminService.loginVerify(loginDetail);
        console.log(loginResult)
        if(loginResult.success == true)
            return res.status(200).json(loginResult);
        else
            return res.status(500).json(loginResult);
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to login' });
    }
}

const participantDetails = async(req,res) =>{
    try{
        if(req.headers.authorization){
            const results = await adminService.getParticipantData(req.headers.authorization);
            if(results.length > 0)
                return res.status(200).json({ success: true, data: results}); 
            else
                return res.status(500).json({ success: false, message: 'No participants registered till now' });   
        }
        else
        {
            return res.status(404).json({ success: false, message: "Please login to view data."});    
        }
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to login' });
    }
}

const manageMembers = async(req,res) =>{
    try{
        if(req.headers.authorization){
            const results = await adminService.manageRegistration(req.headers.authorization, req.body);
            if(results.length > 0)
                return res.status(200).json({ success: true, data: results}); 
            else
                return res.status(500).json({ success: false, message: 'No waiting members' });   
        }
        else
        {
            return res.status(404).json({ success: false, message: "Please login to manage members."});    
        }
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to login' });
    }
}

const waitingMemberDetails = async(req,res) =>{
    try{
        if(req.headers.authorization){
            const results = await adminService.waitingMember(req.headers.authorization);
            if(results.length > 0)
                return res.status(200).json({ success: true, data: results}); 
            else
                return res.status(500).json({ success: false, message: 'Please login to view waiting members' });   
        }
        else
        {
            return res.status(404).json({ success: false, message: "Please login to view data."});    
        }
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to login' });
    }
}

const logout = async(req,res) =>{
    try{
        const param = req.body;
        const result = await adminService.logoutSession(param);
        if(result.success == true)
            return res.status(200).json({ success: true, message: "Logged out succesfully"}); 
        else
            return res.status(500).json({ success: false, message: "Some error occured"}); 
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to login' });
    }
}

module.exports = {
    login,
    participantDetails,
    manageMembers,
    waitingMemberDetails,
    logout
}
