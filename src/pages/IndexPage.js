import {Box, Stack, Typography} from "@mui/material";
import React from "react";

export default function IndexPage() {
    return (
        <Stack pt={4} justifyContent={"space-between"} direction={"column"}>
            <Stack spacing={2}>
                <Typography variant="h2" fontWeight={"bold"}>{`Vítej v aplikaci Fakturka!`}</Typography>
                <Box maxWidth={500}>
                    <Typography color={"gray"} pl={1}>
                        {`Fakturka je moderní aplikace pro snadnou a rychlou správu faktur. Vytvářej, spravuj a odesílej faktury s minimálním úsilím a maximální efektivitou. - chatíček`}
                    </Typography>
                </Box>
                <img src="/images/priniting-invoices.svg" alt="Printing invoice"/>
            </Stack>
        </Stack>
    )
}