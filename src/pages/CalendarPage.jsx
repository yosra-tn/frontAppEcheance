import React, { useState, useEffect,useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import './CalendarPage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories] = useState(['travail', 'personal', 'other']);
  const [typeOccurences] = useState(['une fois', 'chaque jour', 'chaque semaine', 'mensuel', 'bimestriel', 'trimestriel', 'annuel']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', start: '', end: '', category: '', typeOccurence: '' });
    const [file, setFile] = useState(null);
  const inputFile = useRef(null)
  const [isFileUploaded, setIsFileUploaded] = useState(false)

  const categoryColors = {
    travail: '#007bff44',
    personal: '#28a7467e',
    other: '#ffc10768'
  };

  useEffect(() => {
    const fetchUserIdAndEvents = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/events`, {
            params: {
              user_id: userId,
              search: searchTerm,
              category: selectedCategory
            }
          });

          if (response.data.length === 0) {
            toast.info("Aucun événement trouvé pour cet utilisateur.");
          } else {
            const formattedEvents = response.data.map(event => ({
              id: event.id,
              title: event.title,
              start: moment(event.startDate).toDate(),
              end: moment(event.endDate).toDate(),
              category: event.category,
              typeOccurence: event.typeOccurence
            }));

            setEvents(formattedEvents);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des événements:', error);
          toast.error('Erreur lors de la récupération des événements.');
        }
      } else {
        toast.error("ID utilisateur introuvable.");
      }
    };

    fetchUserIdAndEvents();
  }, [searchTerm, selectedCategory]);

  const handleSelectSlot = ({ start, end }) => {
    setFormData({ title: '', start, end, category: '', typeOccurence: '' });
    setIsEditing(false);
    setFormVisible(true);
  };

  const handleSelectEvent = (event) => {
    setFormData(event);
    setIsEditing(true);
    setFormVisible(true);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || event.category === selectedCategory)
  );

  const handleSaveEvent = async () => {
    if (formData.title && formData.start && formData.end && formData.category && formData.typeOccurence) {
      const formattedData = {
        ...formData,
        startDate: moment(formData.start).format('YYYY-MM-DDTHH:mm:ss'),
        endDate: moment(formData.end).format('YYYY-MM-DDTHH:mm:ss'),
        category: formData.category,
        typeOcc: formData.typeOccurence,
        user_id: localStorage.getItem('userId')
      };

      try {
        if (isEditing) {
          await axios.put(`http://127.0.0.1:8000/events/${formattedData.id}`, formattedData);
          setEvents((prevEvents) =>
            prevEvents.map(event => event.id === formData.id ? { ...formattedData, id: formData.id } : event)
          );
          toast.success('Événement modifié avec succès');
        } else {
          const response = await axios.post('http://127.0.0.1:8000/events', formattedData);

          // Vérifiez ici et formatez les dates avant de mettre à jour l'état
          const newEvent = {
            ...response.data,
            start: new Date(response.data.startDate),
            end: new Date(response.data.endDate)
          };

          setEvents((prevEvents) => [...prevEvents, newEvent]);
          toast.success('Événement ajouté avec succès');
        }

        toast.info(`Vous recevrez un email de rappel pour l'échéance "${formattedData.title}" le ${moment(formattedData.start).format('LL')}.`);
        setFormVisible(false);
        setIsEditing(false);
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'événement:', error);
        toast.error('Erreur lors de l\'enregistrement de l\'événement');
      }
    } else {
      toast.error('Veuillez remplir tous les champs');
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/events/${formData.id}`);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== formData.id));
      setFormVisible(false);
      setIsEditing(false);
      toast.success('Événement supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'événement');
    }
  };

  const handleCloseModal = () => {
    setFormVisible(false);
    setIsEditing(false);
    setFormData({ title: '', start: '', end: '', category: '', typeOccurence: '' });
  };

  const moveEvent = async ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    try {
      await axios.put(`http://127.0.0.1:8000/events/${event.id}`, updatedEvent);
      setEvents(events.map(ev => (ev.id === event.id ? updatedEvent : ev)));
      toast.success('Événement déplacé avec succès');
    } catch (error) {
      toast.error('Erreur lors du déplacement de l\'événement');
    }
  };
  const handleFileChange = (e) =>{
    const files = e.currentTarget.files
    if(files)
    setFile(files[0])
    // show success message on file upload
    setIsFileUploaded(true)
  }
  const handleFileSubmit = async (e) => {
    const userId = localStorage.getItem('userId')
    e.preventDefault()

    const formData = new FormData()
    if (file) {
      formData.append('file', file);
      formData.append('user_id',userId);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/upload_events/', formData, { headers: { "Content-Type": "multipart/form-data"} })
      console.log(response);
      
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <div className="calendar-container">
      <ToastContainer />
      <h2 className="calendar-title">Calendrier des Échéances</h2>
      <input
        type="text"
        placeholder="Rechercher un événement"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="category-filter"
      >
        <option value="">Tous les Catégories</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>{cat}</option>
        ))}
      </select>
      <br />
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '500px', width: '100%' }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        resizable
        onEventDrop={moveEvent}
        draggableAccessor={(event) => true}
        eventPropGetter={(event) => {
          const backgroundColor = categoryColors[event.category] || '#17a2b8';
          return {
            style: {
              backgroundColor: backgroundColor,
              color: '#fff',
              borderRadius: '5px',
              border: '1px solid #ddd',
              padding: '2px 4px',
            }
          };
        }}
      />
      <div className='uploadContainer'>
        <input className='fileInput' type="file" onChange={handleFileChange} />
        <button className='uploadButton' onClick={handleFileSubmit}>submit</button>
      </div>

      {formVisible && (
        <div className='form'>
          <div className='form-content'>
            <h3>{isEditing ? 'Modifier' : 'Ajouter'} un événement</h3>
            <input
              type='text'
              placeholder='Titre'
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <br />
            Date de Début:
            <input
              type='datetime-local'
              value={moment(formData.start).format('YYYY-MM-DDTHH:mm:ss')}
              onChange={(e) => setFormData({ ...formData, start: moment(e.target.value).toISOString() })}
            />
            <br />
            Date de Fin:
            <input
              type='datetime-local'
              value={moment(formData.end).format('YYYY-MM-DDTHH:mm:ss')}
              onChange={(e) => setFormData({ ...formData, end: moment(e.target.value).toISOString() })}
            />
            <br />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value=''>Catégorie</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
            <br />
            <select
              value={formData.typeOccurence}
              onChange={(e) => setFormData({ ...formData, typeOccurence: e.target.value })}
            >
              <option value=''>Type d'Occurrence</option>
              {typeOccurences.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
            <br />
            <button onClick={handleSaveEvent}>{isEditing ? 'Modifier' : 'Ajouter'}</button>
            <button onClick={handleCloseModal}>Fermer</button>
            {isEditing && <button onClick={handleDeleteEvent} style={{ backgroundColor: 'red' }}>Supprimer</button>}
          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarPage;
