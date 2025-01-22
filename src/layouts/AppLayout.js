import {Container, Stack} from "@mui/material";
import Header from "../components/Header";
import React from "react";


export default function AppLayout({children}) {
    return (
        <Stack flex={1}>
            <Header/>
            <Container>
                {children}
            </Container>
        </Stack>
    )
}