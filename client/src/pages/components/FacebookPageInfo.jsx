import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function FacebookPageInfo ({ accessToken, pageId }){
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInsights = async () => {
            if (!pageId) return;

            try {
                // fetching page accesstoken
                console.log('pageid is', pageId);
                const myResponse = await axios.get(`https://graph.facebook.com/v22.0/me/accounts`, {
                    params: {
                        access_token: accessToken,
                    }
                })
                const pageAccessToken = myResponse.data.data[0].access_token;
                if (pageAccessToken) {

                    // https://developers.facebook.com/docs/graph-api/reference/v22.0/insights

                    async function fetchResponse(metricProp, metricPeriod){
                        const response = await axios.get(`https://graph.facebook.com/${pageId}/insights`, {
                            params: {
                                access_token: pageAccessToken,
                                metric: metricProp,
                                period: metricPeriod,
                            }
                        });
                        console.log(response.data);
                        const formattedData = response.data.data.reduce((acc, insight) => {
                            const name = insight.name;
                            const value = insight.values[0]?.value;
                            if (value || value === 0) {
                                acc[name] = value;
                            }
                            return acc;
                        }, {});

                        setInsights((prevInsights) => ({
                            ...prevInsights,
                            ...formattedData
                        }));

                        console.log('formattedData is ', formattedData);
                    }

                    const requiredProps = {
                        'page_fans':'day',
                        'page_post_engagements': 'days_28',
                        'page_impressions': 'days_28',
                        'page_actions_post_reactions_total': 'day'
                    }

                    for (const [metric, period] of Object.entries(requiredProps)) {
                        await fetchResponse(metric, period);
                    }
                }


            } catch (error) {
                console.error('Error fetching insights:', error.response ? error.response.data : error.message);
                setError(`Failed to fetch insights: ${error.response ? error.response.data.error.message : error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [accessToken, pageId]); // Trigger useEffect when accessToken or pageId changes

    if (loading) {
        return <div>Loading insights...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (insights.length === 0) {
        return <div>No insights available.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center p-2 flex-wrap">
            <h3 className="font-[Helvetica]">We've fetched following data for your selected page</h3>
            <div className="flex flex-col my-2">
                {Object.keys(insights).length === 0 ? (
                    <p>Loading insights...</p> // Show a loading message if there are no insights yet
                ) : (
                    <ul>
                        {Object.entries(insights).map(([metric, value],index) => (
                            <li key={metric} className={`item-center p-2 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'} opacity-80 hover:opacity-100`}>
                                <div className="flex gap-2 justify-items-start">
                                    <strong className="font-[Helvetica] capitalize">{metric.replace(/_/g, ' ')}:</strong>
                                    {typeof value === 'object' && Object.keys(value).length === 0
                                        ? "No data available"
                                        : value
                                    }
                                </div>

                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>

    );
};

