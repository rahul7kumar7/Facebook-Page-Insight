import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PageSelectorDropdown ({ accessToken, onPageSelect }){
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await axios.get('https://graph.facebook.com/me/accounts', {
                    params: {
                        access_token: accessToken
                    }
                });
                setPages(response.data.data);
            } catch (err) {
                console.error('Error fetching pages:', err);
                setError('Failed to fetch pages. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchPages();
        }
    }, [accessToken]);

    if (loading) {
        return <div>Loading pages...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <h2>Pages you Owned</h2>
            <select className="my-2 border-2 p-3 w-full" onChange={(e) => onPageSelect(e.target.value)}>
                <option value="">Select a Page to Track</option>
                {pages.map(page => (
                    <option key={page.id} value={page.id}>
                        {page.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
