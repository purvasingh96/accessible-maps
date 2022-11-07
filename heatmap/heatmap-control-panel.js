"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var material_1 = require("@mui/material");
function GeoMapControlPanel(props) {
    var menuItems = [];
    props.dimensions.forEach(function (value, key) {
        menuItems.push(React.createElement(material_1.MenuItem, { key: key, value: key }, value.label));
    });
    var handleChange = function (event) {
        console.log("Change detetced: ", event);
        props.onChange(event.target.value);
    };
    return (React.createElement("div", { className: "geo-map-control-panel" },
        React.createElement("p", { className: "title" }, props.name),
        React.createElement(material_1.FormControl, { fullWidth: true },
            React.createElement(material_1.InputLabel, { id: "choose-stats-label" }, "Choose a Statistic"),
            React.createElement(material_1.Select, { labelId: "choose-stats-label", label: "Choose a Statistic", id: "choose-stats", defaultValue: props.dimensions.keys().next().value, onChange: handleChange, variant: "outlined" }, menuItems))));
}
exports.default = GeoMapControlPanel;
//# sourceMappingURL=heatmap-control-panel.js.map