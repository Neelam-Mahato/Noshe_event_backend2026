const { agendaService } = require('../services');

const agendaDetails = async(req,res) =>{
    try{
        const filterData = req.body;
        const agendaData = await agendaService.agendaDetailsService(filterData);
        return res.status(200).json({ success: true, data: agendaData });
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to retrive agenda details.' });
    }
}

const agendaFilters = async(req,res) =>{
    try{
        const filterData = req.query;
        const agendaData = await agendaService.agendaFiltersService(filterData);
        return res.status(200).json({ success: true, data: agendaData });
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to retrive agenda filters.' });
    }
}

const favoriteAgenda = async(req,res) =>{
    try{
        const favoriteData = req.body;
        const agendaData = await agendaService.agendaFavorite(favoriteData);
        if(agendaData.success == true ){
            if(favoriteData.favorite == 1){
                return res.status(200).json({ success: true, message: "Favorite added successfully" });
            }
            else{
                return res.status(200).json({ success: true, message: "Favorite removed successfully" });  
            }
        }
        else
            return res.status(500).json({ success: true, message: "Favorite updation failed" });
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to retrive agenda filters.' });
    }
}



const favoriteDetails = async(req,res) =>{
    try{
              console.log(1)

        const agendaData = await agendaService.favoriteDetails();
        if(agendaData.length > 0)
            return res.status(200).json({ success: true, data: agendaData });
        else
            return res.status(404).json({ success: false, data: "No data found" });
    }
    catch (error){
         return res.status(500).json({ success: false, message: 'Failed to retrive agenda filters.' });
    }
}

module.exports = {
    agendaDetails,
    agendaFilters,
    favoriteAgenda,
    favoriteDetails
}