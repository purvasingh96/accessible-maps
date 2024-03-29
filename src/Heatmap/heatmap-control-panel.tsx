import * as React from 'react';
import {useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import TableModal from './table-modal';


type GeoMapControlPanelProps = {
    name: String,
    dimensions: Map<string, string>,
    onChange: Function,
	onChangeBorderWidth: Function,
	dataUrl: string,
	borderWidth: number,
	showToolTip: boolean,
	showPopup: boolean,
	onChangeShowToolTip: Function,
	onChangeShowPopup: Function
}

function GeoMapControlPanel(props: GeoMapControlPanelProps) {
	const menuItems: any = [];
	const [property, setProperty] = useState(props.dimensions.keys().next().value);
	
	
    props.dimensions.forEach((value: any, key: any) => {
        menuItems.push(<MenuItem key={key} value={key}>{value.label}</MenuItem>);
    });

	const handleChange = (event: SelectChangeEvent) => {
		const eventTargetValue = event.target.value;
		props.onChange(eventTargetValue);
		setProperty(eventTargetValue);
	}

	const handleTooltipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const eventTargetValue = event.target.checked;
		props.onChangeShowToolTip(eventTargetValue);
	}

	const handlePopupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const eventTargetValue = event.target.checked;
		props.onChangeShowPopup(eventTargetValue);
	}

	return (
		<>
		<div className="control-panel" style={{top:0, right:0, position: 'absolute'}}>
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
				
				<FormControlLabel 
				control={<input type={"checkbox"} checked={props.showToolTip} 
				onChange={handleTooltipChange} />} 
				label="View data via tooltip" />

				<FormControlLabel 
				control={<input type={"checkbox"} checked={props.showPopup} 
				onChange={handlePopupChange} />} 
				label="View data via popups" />

				<div key={'borderWidth'} className="input">
					<label>Border Width</label>
					<input
					type="range"
					value={props.borderWidth}
					min={1}
					max={7}
					step={1}
					onChange={evt => props.onChangeBorderWidth(evt.target.value)}
					/>
				</div>
			</FormControl>
			
		</div>
		
		</>
	);
}

export default GeoMapControlPanel;