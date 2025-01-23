import {Typography, Box, Stack, TextField} from '@mui/material';
import TemplatesList from "../components/TemplatesList";
import {useDispatch, useSelector} from "react-redux";
import {UserInvoicesTable} from "../components/UserInvoicesTable";
import {setInterval, startTimer} from "../utils/redux/slices/timerSlice";

const Dashboard = () => {
    const user = useSelector(state => state.auth);
    const dispatch = useDispatch()

    return (
        <Stack pt={4} spacing={6}>
            <Stack spacing={2}>
                <Typography variant="h3" fontWeight={"bold"}>{`Vítej zpět ${user.username || "error"}!`}</Typography>
                <Box maxWidth={500}>
                    <Typography color={"gray"}>
                        {`Rádi tě zase vidíme. Zkontroluj nejnovější faktury nebo si připrav novou šablonu pro své fakturace.`}
                    </Typography>
                </Box>
            </Stack>

            <Stack spacing={2} variant={"h5"}>
                <Box>
                    <Typography variant={"h5"}>Šablony faktur</Typography>
                    <Typography color={"gray"}>Vytvoř novou fakturu podle vzoru.</Typography>
                </Box>
                <TemplatesList/>
            </Stack>

            <Stack spacing={2}>
                <Box>
                    <Typography variant={"h5"}>Tvé Faktury</Typography>
                    <Typography color={"gray"}>Vyber fakturu pro zobrazení náhledu.</Typography>
                </Box>
                <UserInvoicesTable/>
            </Stack>
        </Stack>
    );
};

export default Dashboard;
