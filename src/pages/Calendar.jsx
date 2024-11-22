import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment); 


function Calendarp() {
    const [myEventsList, setMyEventsList] = useState(["projet", "projet2", "projet3"]);
    
   
  return (
    <div className='calendar-container'>
        
            <Calendar
            localizer={localizer}
            events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        
       
    </div>
  )
}

export default Calendarp
