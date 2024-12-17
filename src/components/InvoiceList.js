import {Box, Button, Card, CardActionArea, Grid2, Stack, Typography} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";

export default function InvoiceList({label, data, navigateTo}) {
    const navigate = useNavigate()

    const handleOpenTemplate = (navigateTo, itemId) => {
        navigate(`/${navigateTo}/${itemId}`);
    };

    return (
        <Stack spacing={2}>
            <Typography variant={"h5"}>{label}</Typography>

            <Grid2 container spacing={2} direction={"row"}>
                {
                    data.length === 0 && <Typography>Žádné šablony k dispozici.</Typography>
                }
                {
                    data.length > 0 && (
                        data.map((item) => (
                            <InvoiceCard item={item} onClick={() => handleOpenTemplate(navigateTo, item.id)}/>
                        ))
                    )
                }
            </Grid2>
        </Stack>
    )
}

function InvoiceCard({item, onClick}) {
    return (
        <Grid2  component={Card} onClick={onClick} size={{xs:12, sm:6 , md: 3}}>
            <CardActionArea>
                <Stack py={3} pl={3} pr={1} spacing={1}>
                    <Typography fontSize={"16px"} color={"gray"}> Faktura </Typography>
                    <Typography fontSize={"20px"}> {item.name}</Typography>
                </Stack>
            </CardActionArea>
        </Grid2>
    )
}