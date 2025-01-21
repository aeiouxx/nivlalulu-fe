import {useEffect, useState} from "react";

export function useLoadHtmlTemplate({id}) {
    const [htmlTemplate, setHtmlTemplates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/templates_data/${id}/${id}.html`);
                if (response.ok) {
                    const templateData = await response.text();
                    setHtmlTemplates(templateData);
                } else {
                    setError(`Failed to fetch template: ${response.statusText}`);
                }
            } catch (err) {
                setError(`Error fetching template: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, []);

    return {htmlTemplate, loading, error};
}