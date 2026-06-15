
const {agendaModel }= require('../models/index');

const agendaDetailsService = async(filterData) => {
  try{
    const agendaData = await agendaModel.agendaDetails({track:filterData.track, categories:filterData.categories,speakers:filterData.speakers,halls:filterData.halls});
    return  agendaData;
  } 
  catch(error){
    return error;
  }  
}

const agendaFiltersService = async(filterData) => {
  try{
    const agendaData = await agendaModel.agendaFilters({search:filterData.search});
    return  agendaData;
  } 
  catch(error){
    return error;
  }  
}

const agendaFavorite = async(favoriteData) => {
  try{
    const favData = await agendaModel.favorite({session_id:favoriteData.session_id,favorite:favoriteData.favorite});
    return  favData;
  } 
  catch(error){
    return error;
  }  
}

const favoriteDetails = async() => {
  try{
          console.log(2)

    const favData = await agendaModel.favoriteData();
    return  favData;
  } 
  catch(error){
    return error;
  }  
}

module.exports = {
    agendaDetailsService,
    agendaFiltersService,
    agendaFavorite,
    favoriteDetails
}