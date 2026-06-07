import { useState } from 'react';
import ParchiContext from './ParchiContext';
import host from '../../config';

const ParchiState = (props) => {

    const [parchi, setParchi] = useState([]);
    const [loading, setLoading] = useState(false);

    const getParchi = async () => {

    const token = localStorage.getItem('token');

    if (!token) {
        console.log('No token found');
        setParchi([]);
        return;
    }

    try {
        setLoading(true);

        const response = await fetch(`${host}/api/parchi/fetchalllist`, {
            method: 'GET',
            headers: {
                "auth-token": token
            }
        });

        const data = await response.json();

        if (Array.isArray(data)) {
            setParchi(data);
        } else {
            console.error('Not an array:', data);
            setParchi([]);
        }

    } catch (error) {
        console.error('Error fetching parchi:', error);
    } finally {
        setLoading(false);
    }
};

    // add parchi
    const addParchi = async (parchiData) => {
        try {
            const response = await fetch(`${host}/api/parchi/addlist`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify( parchiData )
            });
            const data = await response.json();

            // update UI instantly
            setParchi(prev => [data, ...prev]);
        } catch (error) {
            console.error(error);
        }
    }

    // delete parchi
    const deleteParchi = async (id) => {
        try {
            await fetch(`${host}/api/parchi/${id}`, {
                method: 'DELETE',
                headers: {
                    "auth-token": localStorage.getItem('token')
                }
            });
            setParchi(prev => prev.filter(parchi => parchi._id !== id));
        } catch (error) {
            console.error(error);
        }
    }

    // add items into the parchilist
    const addItemToParchi = async (id, name) => {
        try {
            const response = await fetch(`${host}/api/parchi/${id}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ name })
            });
            const updatedParchi = await response.json();

            // update the UI
            setParchi(prev => prev.map(parchi => parchi._id === id ? updatedParchi : parchi));
        } catch (error) {
            console.error('Error adding item to parchi: ', error);
        }
    };

    // updating the status and the storename of the parchi
    const updateItem = async (itemId, updates ) => {
        try {
            const response = await fetch(`${host}/api/parchi/item/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(updates)
            });
            const updatedItem = await response.json();

            // update the UI
            setParchi(prev => prev.map(parchi => parchi._id === updatedItem._id ? updatedItem: parchi));
        } catch (error) {
            console.error(
                'Update error: ', error
            );
        }
    };

    // delete item from parchi
    const deleteItem = async (itemId) => {
        try {
            const response = await fetch(`${host}/api/parchi/item/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });

            const updatedParchi = await response.json();

            setParchi(prev => prev.map(p => p._id === updatedParchi._id ? updatedParchi: p));
        } catch (error){
            console.error('Delete item error: ', error);
        }
    };

    return (
        <ParchiContext.Provider value={{ parchi, setParchi, getParchi, loading, deleteParchi, addParchi, addItemToParchi, updateItem, deleteItem }}>
            {props.children}
        </ParchiContext.Provider>
    );
}

export default ParchiState;