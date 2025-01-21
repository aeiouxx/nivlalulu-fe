import * as React from 'react';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Alert} from "@mui/material";

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#272727",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

// Upravený StyledTableRow bez předávání `isHovered` přímo do DOM elementu
const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    },
    cursor: 'pointer',
}));

const CustomTable = ({columns, data, onRowClick, noDataMessage}) => {
    const handleRowClick = (row) => {
        if (onRowClick) {
            onRowClick(row);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <StyledTableCell key={column.field} align={column.align || 'left'}>
                                {column.headerName}
                            </StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <StyledTableRow
                            key={rowIndex}
                            onClick={() => handleRowClick(row)}
                        >
                            {columns.map((column) => (
                                <StyledTableCell key={column.field} align={column.align || 'left'}>
                                    {column.render ? column.render(row[column.field], row) : row[column.field]}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            {
                data.length === 0 && <Alert severity={'warning'} >This table is empty.</Alert>
            }
        </TableContainer>
    );
};

export default CustomTable;