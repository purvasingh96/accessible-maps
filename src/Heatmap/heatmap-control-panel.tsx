import * as React from 'react';
import {useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import TableModal from './table-modal';


type GeoMapControlPanelProps = {
    name: String,
    dimensions: Map<string, string>,
    onChange: Function,
	onChangeCheck: Function,
	dataUrl: string
}

function GeoMapControlPanel(props: GeoMapControlPanelProps) {
	const menuItems: any = [];
	const [property, setProperty] = useState(props.dimensions.keys().next().value);
	const [check, setCheck] = useState(false);
	
	
    props.dimensions.forEach((value: any, key: any) => {
        menuItems.push(<MenuItem key={key} value={key}>{value.label}</MenuItem>);
    });

	const handleChange = (event: SelectChangeEvent) => {
		const eventTargetValue = event.target.value;
		props.onChange(eventTargetValue);
		setProperty(eventTargetValue);
	}

	const handleCheckboxChange = (event: SelectChangeEvent) => {
		const new_check = !check;
		setCheck(new_check);
		console.log("event.target.value: ", event.target.value);
		props.onChangeCheck(new_check);
	}

	return (
		<>
		<div className="control-panel">
			<p className="title">{props.name}</p>
			<FormControl fullWidth>
				{/* <InputLabel shrink id="choose-stats-label">Choose a Statistic</InputLabel> */}
				<Select
					labelId="outlined-choose-stats-label"
					label="Choose a Statistic"
					id="choose-stats"
					defaultValue={props.dimensions.keys().next().value}
					onChange={handleChange}
					variant="outlined"
				>
					{menuItems}
				</Select>
				<TableModal name={property} dataUrl={props.dataUrl}/>	
				<FormControlLabel control={<input type={"checkbox"} checked={check} onChange={handleCheckboxChange} />} label="View Pattern Layer" />
			</FormControl>
			
		</div>
		
		</>
	);
}

export default GeoMapControlPanel;