import {Grid2, Typography} from "@mui/material";
import React from "react";
import TemplatesListItem from "./TemplatesListItem";
import {useLoadJsonTemplate} from "../functions/useLoadJsonTemplate";

export default function TemplatesList() {
    const {jsonTemplate, loading: templatesLoading, error: templatesLoadingError} = useLoadJsonTemplate({id: 1});

    if (templatesLoading) return <p>Loading templates...</p>;
    if (templatesLoadingError) return <p>Error fetching templates: {templatesLoadingError.message}</p>;

    return (
        <Grid2 container spacing={2} direction={"row"}>
            {jsonTemplate.length === 0 && <Typography>Žádné šablony k dispozici.</Typography>}
            {jsonTemplate.length > 0 && (jsonTemplate.map((item) => (<TemplatesListItem item={item}/>)))}
        </Grid2>
    )
}
