import {Card, CardActionArea, Grid2, Stack, Typography} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";

export default function TemplatesListItem({item}) {
    const navigate = useNavigate()

    const handleOnClick = () => {
        // navigates to first AND ONLY invoice template we have
        navigate(`/template/1`)
    }

    return (
        <Grid2 component={Card} onClick={handleOnClick} size={{xs: 12, sm: 6, md: 3}}>
            <CardActionArea>
                <Stack py={3} pl={3} pr={1} spacing={1}>
                    <Typography fontSize={"16px"} color={"gray"}> Šablona faktury </Typography>
                    <Typography fontSize={"20px"}> {item.name}</Typography>
                </Stack>
            </CardActionArea>
        </Grid2>
    )
}