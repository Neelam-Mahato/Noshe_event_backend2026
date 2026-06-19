  
  const db = require('../config/db'); 

  const agendaDetails= async (payload) => {
    try{ 
      console.log(payload)
          let params =[];
          let query = `SELECT
    s.session_id,
    s.session_categories,
    s.session_timeline,
    s.session_tenure,
    s.session_halls,
    s.session_day,
    s.session_track,
    s.session_details,
    s.session_date,
    s.favorite,
    IF(
        COUNT(es.event_session_id) = 0,
        JSON_ARRAY(),
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'speaker_name', es.speaker_name,
                'speaker_designation', es.speaker_designation,
                'speaker_company', es.speaker_company,
                'speaker_image', es.speaker_image
            )
        )
    ) AS speakers
FROM event_session s
LEFT JOIN event_session_speakers es
    ON s.session_id = es.session_id
WHERE 1=1`;
          if (payload.halls?.length) {
          query += ` AND s.session_halls IN (${payload.halls.map(() => '?').join(',')})`;
          params.push(...payload.halls);
      }
      
      if (payload.track?.length) {
          query += ` AND s.session_track IN (${payload.track.map(() => '?').join(',')})`;
          params.push(...payload.track);
      }

      if (payload.categories?.length) {
          query += ` AND s.session_categories IN (${payload.categories.map(() => '?').join(',')})`;
          params.push(...payload.categories);
      }
       if (payload.speakers?.length) {
          query += ` AND es.speaker_name IN (${payload.speakers.map(() => '?').join(',')})`;
          params.push(...payload.speakers);
      }
      query += ` GROUP BY s.session_id ORDER BY s.session_id ASC` ;
    const [result] = await db.execute(query, params);
    const response = {
    day1: result.filter(item => item.session_day === 'Day 1'),
    day2: result.filter(item => item.session_day === 'Day 2')
};
    return response; 
     } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
  }

const agendaFilters= async (payload) => {
    try{ 
        console.log(payload)
        const searchTerm = payload.search?.trim();

        let query = `SELECT distinct
        (Select JSON_ARRAYAGG(JSON_OBJECT('session_track',session_track)) from (Select distinct session_track from event_session WHERE session_track IS NOT NULL AND TRIM(session_track) != '' ) a ) as tracks,
        (Select JSON_ARRAYAGG(JSON_OBJECT('session_categories',session_categories)) from (Select distinct session_categories from event_session WHERE session_categories IS NOT NULL AND TRIM(session_categories) != '' ) d) as categories,
        (Select JSON_ARRAYAGG(JSON_OBJECT('session_halls',session_halls)) from (Select distinct session_halls from event_session WHERE session_halls IS NOT NULL AND TRIM(session_halls) != '' ) p ) as halls,
        (Select JSON_ARRAYAGG(JSON_OBJECT('speaker_name', speaker_name)) from (Select distinct speaker_name from event_session_speakers WHERE speaker_name IS NOT NULL AND TRIM(speaker_name) != '' ) s ) as speakers
        FROM event_session`;
        const [result] = await db.execute(query);
        const raw = result[0];
        const parse = (val) => typeof val === 'string' ? JSON.parse(val) : (val || []);

        const data = {
          tracks:     { key: 'session_track',      items: parse(raw.tracks) },
          categories: { key: 'session_categories', items: parse(raw.categories) },
          halls:      { key: 'session_halls',      items: parse(raw.halls) },
          speakers:   { key: 'speaker_name',       items: parse(raw.speakers) },
        };

        if (!searchTerm?.trim()) return Object.fromEntries(
          Object.entries(data).map(([group, { items }]) => [group, items])
        );

        const keyword = searchTerm.toLowerCase().trim();

        const result1 = {};
        for (const [group, { key, items }] of Object.entries(data)) {
          const filtered = items.filter(item => item[key] != null && String(item[key]).toLowerCase().includes(keyword));
          if (filtered.length) result1[group] = filtered;
        }
        console.log(query,result1)
        return result1;
     } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
  }

  const favorite= async (payload) => {
    try{
        const searchTerm = [payload.favorite,payload.session_id];
        let query = `Update event_session set favorite = ? where session_id = ?`;
        const [result] = await db.execute(query,searchTerm);
        return result.affectedRows == 1 ? {success:true} : {success: false}; 

     } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
  }

  const favoriteData= async () => {
    try{ 

          let params =[1];
          let query = `SELECT
    s.session_id,
    s.session_categories,
    s.session_timeline,
    s.session_tenure,
    s.session_halls,
    s.session_day,
    s.session_track,
    s.session_details,
    s.session_date,
    s.favorite,
    IF(
        COUNT(es.event_session_id) = 0,
        JSON_ARRAY(),
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'speaker_name', es.speaker_name,
                'speaker_designation', es.speaker_designation,
                'speaker_company', es.speaker_company,
                'speaker_image', es.speaker_image
            )
        )
    ) AS speakers
FROM event_session s
LEFT JOIN event_session_speakers es
    ON s.session_id = es.session_id
WHERE s.favorite = ?`;
     
      query += ` GROUP BY s.session_id` ;
      console.log(query)
    const [result] = await db.execute(query,params);
    

    return result; 
     } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
  }

module.exports = {
    agendaDetails,
    agendaFilters, 
    favorite,
  favoriteData};