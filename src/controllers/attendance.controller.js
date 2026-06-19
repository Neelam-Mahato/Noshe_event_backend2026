const { attendanceService } = require('../services');

const attendance = async(req,res) =>{
    try{
        const scanData = req.body;
        const agendaData = await attendanceService.attendanceMember(scanData);
        return res.status(200).json({ success: true, message: agendaData.message });
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to mark attendance' });
    }
}

module.exports = {
    attendance
}