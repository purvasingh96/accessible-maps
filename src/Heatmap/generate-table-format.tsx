import * as React from 'react';
import {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import Papa from "papaparse";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export type COVIDStatisticsType = {
    name: string,
    descrtiption: string,
    cases: string,
    active: string,
    casesPerOneMillion: string,
    deaths: string,
    deathsPerOneMillion: string,
    population: string,
    recovered: string,
    state: string,
    tests: string,
    testsPerOneMillion: string,
    todayCases: string,
    todayDeaths: string
}

type ConvertCSVToTableProps={
    name: string;
    dataUrl: string;
}


function ConvertCSVToTable(props: ConvertCSVToTableProps) {
    const defaultHeaders: string[] = ['name', 'description'];
    const [rows, setRows] = useState([]);
    const [headers, setHeaders] = useState(defaultHeaders);
    const [propertyColumn, setPropertyColumn] = useState();

    useEffect(() => {
      async function getData() {
        const response = await fetch(props.dataUrl)
        
        const reader = response.body.getReader()
        
        const result = await reader.read() // raw array
        
        const decoder = new TextDecoder('utf-8')
        const csv = decoder.decode(result.value) // the csv text
        const results = Papa.parse(csv, { header: true }) // object with { data, errors, meta }
        const rows = results.data; // array of objects
        setHeaders(defaultHeaders.concat(props.name))
        setRows(rows as COVIDStatisticsType[]);
      }
      getData()
    }, []); // [] means just do this once, after initial render
    
    return (
        <Paper variant="outlined" sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 500 }}>
            <Table sx={{ minWidth: 500, minHeight: 500}} aria-label="Table format for COVID data">
            <TableHead>   
                <TableRow>
                    {headers.map((header) => (<TableCell>{header}</TableCell>))} 
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, i) => (
                <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                    {row.name}
                    </TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left">{row[props.name]}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
      </Paper>
    )

}

export default ConvertCSVToTable;
