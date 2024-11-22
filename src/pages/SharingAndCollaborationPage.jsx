import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SharingAndCollaborationPage.css';

const SharingAndCollaborationPage = () => {
    const [email, setEmail] = useState('');
    const [projectId, setProjectId] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const userId = localStorage.getItem('userId'); // Récupère l'ID de l'utilisateur depuis le localStorage

    // Fonction pour récupérer les projets et collaborateurs via l'API
    const fetchProjectsAndCollaborators = async () => {
        if (!userId) {
            setError("User ID is missing in local storage.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8015/user/${userId}/collaborators`);
            const data = response.data.collaborators; // Récupère les projets et leurs collaborateurs
            const formattedProjects = Object.keys(data).map((title) => ({
                id: title,
                name: title,
                collaborators: data[title],
            }));
            setProjects(formattedProjects);
        } catch (err) {
            setError("Une erreur s'est produite lors du chargement des projets.");
        } finally {
            setLoading(false);
        }
    };

    // Appel de la fonction pour récupérer les projets au montage du composant
    useEffect(() => {
        fetchProjectsAndCollaborators();
    }, []);

    // Gérer l'invitation d'un collaborateur
    const handleInvite = async () => {
        if (!email || !projectId) {
            alert('Veuillez sélectionner un projet et entrer un email.');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8015/inviter', {
                email,
                event_id: projectId, // Correspond à l'ID de l'événement
            });
            alert(response.data.message || 'Invitation envoyée avec succès.');
            fetchProjectsAndCollaborators(); // Rafraîchir la liste
            setEmail('');
            setProjectId('');
        } catch (err) {
            alert(err.response?.data?.detail || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    // Gérer la modification des permissions
    const handlePermissionChange = async (projectId, email, currentPermission) => {
        const newPermission = currentPermission === 'read' ? 'write' : 'read';
        if (window.confirm(`Changer la permission de ${email} à "${newPermission}" ?`)) {
            try {
                setLoading(true);
                await axios.put('http://127.0.0.1:8015/update_permission', {
                    email,
                    event_id: projectId,
                    permission: newPermission,
                });
                fetchProjectsAndCollaborators(); // Mettre à jour la liste
            } catch (err) {
                alert('Erreur lors de la mise à jour des permissions.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="collaboration-container">
            <h2>Page de Partage et Collaboration</h2>
            {error && <p className="error">{error}</p>}

            <div className="invite-section">
                <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                >
                    <option value="" disabled>Choisissez un projet</option>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
                <input
                    type="email"
                    placeholder="Entrez l'email du collaborateur"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleInvite} disabled={loading}>
                    {loading ? 'En cours...' : 'Inviter'}
                </button>
            </div>

            <h3>Projets et Collaborateurs</h3>
            {loading ? (
                <p>Chargement...</p>
            ) : (
                projects.map((project) => (
                    <div key={project.id} className="project-section">
                        <h4>{project.name}</h4>
                        <ul className="collaborator-list">
                            {project.collaborators.map((collab) => (
                                <li key={collab.id} className="collaborator-item">
                                    <div>
                                        <span>{collab.email}</span>
                                        <span className={`status`}>
                                            {collab.permission}
                                        </span>
                                    </div>
                                    <div className="actions">
                                        <span
                                            className={`permission ${collab.permission}`}
                                            onClick={() =>
                                                handlePermissionChange(project.id, collab.email, collab.permission)
                                            }
                                        >
                                            {collab.permission}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default SharingAndCollaborationPage;
