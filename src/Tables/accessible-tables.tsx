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
import { COVIDStatisticsType } from '../Heatmap/generate-table-format';
import { TableSortLabel } from '@mui/material';

type AccessibleTablesProps={
    dataUrl: string;
}


function AccessibleTables(props: AccessibleTablesProps) {
    type order = 'asc' | 'desc';
    const defaultHeaders: string[] = [];
    const [rows, setRows] = useState([]);
    const [currCol, setCurrCol] = useState('cases');
    const [headers, setHeaders] = useState(defaultHeaders);
    const [orderDirection, setOrderDirection] = useState('asc' as order);

    useEffect(() => {
      async function getData() {
        const response = await fetch(props.dataUrl);
        console.log(props.dataUrl);
        
        const reader = response.body.getReader()
        
        const result = await reader.read() // raw array
        
        const decoder = new TextDecoder('utf-8')
        const csv = decoder.decode(result.value) // the csv text
        const results = Papa.parse(csv, { header: true }) // object with { data, errors, meta }
        const rows = results.data; // array of objects
        setHeaders(results.meta.fields);
        setRows(rows as COVIDStatisticsType[]);
      }
      getData()
    }, [props]); // [] means just do this once, after initial render
    

    const sortArray = (arr, property, orderBy) => {
        switch(orderBy) {
            case 'asc':
                default:
                    return arr.sort((a, b) => 
                        a[property] > b[property] ? 1: b[property] > a[property] ? -1 : 0
                    );

            case 'desc':
                return arr.sort((a, b) =>
                    a[property] < b[property] ? 1 : b[property] < a[property] ? -1 : 0
                )
        }
    }

    const handleSortRequest = (property) => {
        setCurrCol(property);
        setRows(sortArray(rows, property, orderDirection));
        orderDirection == 'asc' ? setOrderDirection('desc') : setOrderDirection('asc');
    }
    
    return (
        <Paper variant="outlined" sx={{ width: '70%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 1000 }}>
            <Table sx={{ minWidth: 1200, minHeight: 1000}} aria-label="Table format for COVID data">
            <TableHead>   
                <TableRow>
                    {headers.map((header) => (
                    <TableCell onClick={() => handleSortRequest(header)}>
                        <TableSortLabel active={header === currCol} direction={header == currCol ? orderDirection : 'asc'}>
                            {header}
                    </TableSortLabel>
                    </TableCell>))} 
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
                    <TableCell align="left">{row.tests}</TableCell>
                    <TableCell align="left">{row.cases}</TableCell>
                    <TableCell align="left">{row.deaths}</TableCell>
                    <TableCell align="left">{row.state}</TableCell>
                    <TableCell align="left">{row.todayCases}</TableCell>
                    <TableCell align="left">{row.todayDeaths}</TableCell>
                    <TableCell align="left">{row.recovered}</TableCell>
                    <TableCell align="left">{row.active}</TableCell>
                    <TableCell align="left">{row.casesPerOneMillion}</TableCell>
                    <TableCell align="left">{row.deathsPerOneMillion}</TableCell>
                    <TableCell align="left">{row.testsPerOneMillion}</TableCell>
                    <TableCell align="left">{row.population}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
      </Paper>
    )

}

export default AccessibleTables;
