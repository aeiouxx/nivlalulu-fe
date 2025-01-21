import {useNavigate} from "react-router-dom";
import {useDeleteInvoiceMutation, useGetItemsQuery} from "../utils/redux/rtk/invoicesApi";
import React from "react";
import CustomTable from "./CustomTable";
import { formatDateToUserInput} from "../functions/timeFunctions";
import { IconButton} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export function UserInvoicesTable() {
    const {data: invoices2, error, isLoading} = useGetItemsQuery();
    const [deleteInvoice] = useDeleteInvoiceMutation();
    const navigate = useNavigate();

    const columns = [
        {field: 'id', headerName: 'id'},
        {field: 'created_at', headerName: 'created_at', render: (_, row) => formatDateToUserInput(row.created_at)},
        {field: 'variable_symbol', headerName: 'variable_symbol'},
        {field: 'total_value', headerName: 'total_value'},
        {field: 'contact', headerName: 'contact'},
        {
            field: "action", headerName: "", render: (_, row) => {
                return (
                    <IconButton onClick={(event) => handleDelete(event, row)}><DeleteForeverIcon/></IconButton>
                )
            }
        }
    ];

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

    if (isLoading) return <p>Loading invoices...</p>;
    if (error) return <p>Error fetching invoices: {error.message}</p>;

    return (
        <CustomTable columns={columns} data={invoices2?.content || []} onRowClick={handleRowClick}/>
    )
}