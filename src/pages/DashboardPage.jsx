import React, { useState } from 'react';
import './DashboardPage.css';

function DashboardPage() {
    const [upcomingDeadlines, setUpcomingDeadlines] = useState([
        { id: 1, description: "Rendre le rapport de projet", dueDate: "2024-11-05" },
        { id: 2, description: "Réunion avec l'équipe", dueDate: "2024-11-12" },
    ]);

    const [overdueDeadlines, setOverdueDeadlines] = useState([
        { id: 1, description: "Préparer la présentation", dueDate: "2024-10-20" },
    ]);


    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Tableau de Bord</h2>

            <h3 className="section-title">Échéances à Venir</h3>
            <ul className="deadline-list">
                {upcomingDeadlines.map(deadline => (
                    <li key={deadline.id} className="deadline-item">
                        <span>{deadline.description}</span>
                        <span className="due-date">{deadline.dueDate}</span>
                    </li>
                ))}
            </ul>

            <h3 className="section-title">Échéances en Retard</h3>
            <ul className="deadline-list">
                {overdueDeadlines.length > 0 ? (
                    overdueDeadlines.map(deadline => (
                        <li key={deadline.id} className="deadline-item overdue">
                            <span>{deadline.description}</span>
                            <span className="due-date">{deadline.dueDate}</span>
                        </li>
                    ))
                ) : (
                    <li className="no-overdue">Aucune échéance en retard</li>
                )}
            </ul>
        </div>
    );
}

export default DashboardPage;
