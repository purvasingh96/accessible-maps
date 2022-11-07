import * as React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
function GeoMapControlPanel(props) {
    const menuItems = [];
    props.dimensions.forEach((value, key) => {
        menuItems.push(React.createElement(MenuItem, { key: key, value: key }, value.label));
    });
    const handleChange = (event) => {
        console.log("Change detetced: ", event);
        props.onChange(event.target.value);
    };
    return (React.createElement("div", { className: "geo-map-control-panel" },
        React.createElement("p", { className: "title" }, props.name),
        React.createElement(FormControl, { fullWidth: true },
            React.createElement(InputLabel, { id: "choose-stats-label" }, "Choose a Statistic"),
            React.createElement(Select, { labelId: "choose-stats-label", label: "Choose a Statistic", id: "choose-stats", defaultValue: props.dimensions.keys().next().value, onChange: handleChange, variant: "outlined" }, menuItems))));
}
export default GeoMapControlPanel;
//# sourceMappingURL=heatmap-control-panel.js.map