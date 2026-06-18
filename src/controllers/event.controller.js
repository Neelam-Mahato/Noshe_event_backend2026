const { eventService } = require('../services');

const registerMember = async(req,res) =>{
    try{
        const registerData = req.body;
        const date = new Date();
        const yesterday = new Date();
        const currentYear = date.getFullYear();
        const targetDate = new Date(currentYear, 6, 4, 19, 0, 0);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date > targetDate) {
            return res.status(500).json({ success: false, message: 'Event has closed. You cannot register any more' }); 
        }
        else{
            const newRegister = await eventService.registerService(registerData);
            if(newRegister.msg == 0){
                return res.status(500).json({ success: false, message: 'You are not a valid member.' });
            }
            else if(newRegister.msg == 2){
                return res.status(500).json({ success: false, message: 'Some error occurred. Failed to register member.' });  
            }
            else if(newRegister.msg == 4){
                return res.status(500).json({ success: false, message: 'You have already applied for registration' });  
            }
            else{
                return res.status(201).json({ success: true, message: "Applied. You will receive an email notification once approved by admin." });
            }
    }
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to register.' });
    }
}

module.exports = {
    registerMember
}
