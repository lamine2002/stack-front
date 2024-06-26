// Importation de axios
import axios from 'axios';

// Fonction pour récupérer les informations de l'utilisateur connecté
export async function getUserConnected() {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', config);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur connecté : ', error);
        return null;
    }
}