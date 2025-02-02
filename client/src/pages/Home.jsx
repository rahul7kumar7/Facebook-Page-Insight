import React, { useState, useEffect } from 'react';
import facebookSdkLoader from '../facebook.js'
import PageSelectorDropdown from '../pages/components/DropdownSelector.jsx'
import FacebookPageInfo from "./components/FacebookPageInfo";

export default function Home () {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState('');
    const [error, setError] = useState('');
    const [selectedPage, setSelectedPage] = useState('');

    useEffect(() => {
        facebookSdkLoader();
    }, []);

    function handleLogin() {
        if (window.FB) {
            window.FB.login((response) => {
                if (response.status === 'connected') {
                    window.FB.api('/me', { fields: 'id, name, picture.width(800).height(800),email' }, (userData) => {
                        if (userData && !userData.error) {
                            setUser(userData);
                            setAccessToken(response.authResponse.accessToken);
                            setError(null);
                            console.log('Access token saved:', response.authResponse.accessToken);
                        } else {
                            setError('Error fetching user data.');
                        }
                    });
                } else {
                    setError('Login to Facebook failed or was cancelled by user.');
                }
            }, { scope: 'pages_show_list, pages_read_engagement, read_insights' });
        } else {
            setError('Issue loading Facebook SDK.');
        }
    }

    const handlePageSelect = (PageSelect) => {
        setSelectedPage(PageSelect); // Update the state with the selected page ID
    };

    return (
        <div className="mx-auto max-w-lg">
            <div className="flex flex-col justify-center items-center gap-3">
                <img src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" width="350px" alt=""/>
                {!user ? (
                    <h1 className="text-center text-[24px] font-[Helvetica]">Login to your facebook account to get
                        insight
                        of your pages.</h1>
                ) : <h1 className="text-center text-[24px] font-[Helvetica]">We've fetched your information.</h1>}

                {!user ? (
                    <button
                        className="rounded-lg my-3 p-3 text-center bg-[#0865fe] text-white font-semibold uppercase hover:opacity-85"
                        onClick={handleLogin}>Connect through Facebook</button>
            ) : (
                    <div className="flex flex-col justify-center items-center gap-3 border-2 p-5 rounded-sm bg-white">
                        <img className="rounded-full object-cover w-[150px] h-auto" src={user.picture.data.url} alt="Profile"/>
                        <h2 className="text-center text-[24px] font-[Helvetica]">{user.name}</h2>
                        <div className="flex flex-col gap-2 items-center text-center bg-gray-100 p-2 rounded-sm">
                            <p>User Id:{user.id}</p>
                            <p>Email:{user.email}</p>
                        </div>
                        <div>
                            <PageSelectorDropdown accessToken={accessToken} onPageSelect={handlePageSelect} />
                            {selectedPage && <FacebookPageInfo accessToken={accessToken} pageId={selectedPage} />}
                        </div>
                    </div>
                )}

                {error && <div className="font-[Helvetica] text-red-500 font-semibold text-[12px]">{error}</div>}
                <div className="p-2">
                    Made by <a href="https://github.com/rahul7kumar7/" className="text-[#0865fe] my-2 hover:underline">github@rahul7kumar7</a>
                </div>
            </div>
        </div>
    );
};

