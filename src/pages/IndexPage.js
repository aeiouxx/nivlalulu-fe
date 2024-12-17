import {Box, Stack, Typography} from "@mui/material";
import React from "react";

export default function IndexPage() {
    return (
        <Stack pt={4} spacing={6}>
            <Stack spacing={1}>
                <Typography variant="h4" fontWeight={"bold"}>{`Vítej v aplikaci Fakturka!`}</Typography>
                <Box maxWidth={500}>
                    <Typography color={"gray"}>
                        {`Fakturka je moderní aplikace pro snadnou a rychlou správu faktur. Vytvářej, spravuj a odesílej faktury s minimálním úsilím a maximální efektivitou. - chatíček`}
                    </Typography>
                </Box>
            </Stack>
        </Stack>
    )
}