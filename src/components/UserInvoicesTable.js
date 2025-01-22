import {useNavigate} from "react-router-dom";
import {
    useDeleteInvoiceMutation,
    useGetAllFilteredInvoicesQuery,
    useGetItemsQuery
} from "../utils/redux/rtk/invoicesApi";
import React, {useEffect, useState} from "react";
import CustomTable from "./CustomTable";
import {formatDateToUserInput} from "../functions/timeFunctions";
import {IconButton, Stack, TextField, ToggleButton, ToggleButtonGroup, useMediaQuery} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export function UserInvoicesTable() {
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:960px)');

    const [searchValue, setSearchValue] = useState("");
    const [searchCriteria, setSearchCriteria] = React.useState('variableSymbol');
    const showSearchResults = searchValue !== ""
    const [filter, setFilter] = useState({})

    const {data: invoices, error, isLoading} = useGetItemsQuery();
    const [deleteInvoice] = useDeleteInvoiceMutation();
    const {
        data: filteredInvoices,
        error: errorLoadingFilteredInvoices,
        isLoading: loadingFilteredInvoices
    } = useGetAllFilteredInvoicesQuery(filter)

    const handleChange = (event, value) => {
        setSearchCriteria(value);
    };

    useEffect(() => {
        setFilter({[searchCriteria]: searchValue})
    }, [searchValue])

    function handleRowClick(row) {
        navigate(`/invoice/${row.id}`)
    }

    async function handleDelete(event, row) {
        event.stopPropagation()
        try {
            await deleteInvoice(row.id).unwrap();
        } catch (error) {
            console.error("Chyba při mazání faktury:", error);
            alert("Nepodařilo se smazat fakturu");
        }
    }

    const columns = [
        {field: 'created_at', headerName: 'Vytvořeno', render: (_, row) => formatDateToUserInput(row.created_at)},
        {field: 'variable_symbol', headerName: 'Variabilní symbol'},
        {field: 'customer', headerName: 'Jméno zákazníka', render: (_, row) => row.customer?.name || "N/A"},
        {field: 'supplier_name', headerName: 'Jméno dodavatele', render: (_, row) => row.supplier?.name || "N/A"},
        {field: 'total_value', headerName: 'Celková částka'},
        {
            field: "action", headerName: "", render: (_, row) => {
                return (
                    <IconButton onClick={(event) => handleDelete(event, row)}><DeleteForeverIcon/></IconButton>
                )
            }
        }
    ];

    if (isLoading) return <p>Loading invoices...</p>;
    if (error) return <p>Error fetching invoices: {error.message}</p>;

    return (
        <Stack spacing={1}>
            <Stack direction={isSmallScreen ? "column" : "row"} spacing={1}>
                <TextField size={"small"} fullWidth label="Vyhledávání podle variabliního symbolu" value={searchValue}
                           onChange={e => setSearchValue(e.target.value)}/>
                <ToggleButtonGroup
                    fullWidth
                    color="primary"
                    value={searchCriteria}
                    exclusive
                    onChange={handleChange}
                    size={"small"}
                >
                    <ToggleButton value="variableSymbol">var.symbol</ToggleButton>
                    <ToggleButton value="customerName">Jméno zákazníka</ToggleButton>
                    <ToggleButton value="supplierName">Jméno dodavatele</ToggleButton>
                </ToggleButtonGroup>
            </Stack>
            <CustomTable columns={columns}
                         data={showSearchResults ? filteredInvoices?.content : invoices?.content || []}
                         onRowClick={handleRowClick}/>
        </Stack>
    )
}