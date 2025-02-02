import {useEffect, useState} from "react";

export function useLoadJsonTemplate({id}) {
    const [jsonTemplate, setHtmlTemplate] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/templates_data/${id}/${id}.json`);
                if (response.ok) {
                    const templateData = await response.text();
                    setHtmlTemplate([JSON.parse(templateData)]);
                } else {
                    setError(`Failed to fetch template: ${response.statusText}`);
                }
            } catch (err) {
                setError(`Error fetching template: ${err.message}`);
                console.warn(err.message)
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, []);

    return {jsonTemplate, loading, error};
}
