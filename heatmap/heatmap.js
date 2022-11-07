"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var react_map_gl_1 = require("react-map-gl");
var date_fns_1 = require("date-fns");
var d3_scale_1 = require("d3-scale");
var d3_array_1 = require("d3-array");
var heatmap_control_panel_1 = require("./heatmap-control-panel");
var MAPBOX_TOKEN = "pk.eyJ1IjoicHVydmFzaW5naCIsImEiOiJjbDQ4amRrYjQwc3RwM2NsbGttbnlpaTRmIn0.djnJ9PjVpJ7g8aIWHHnPGA"; // Set your mapbox token here
var legendItems = ['_layerId', 'name', 'density', 'population', 'state', 'updated'];
var colors = function (specifier) {
    var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
    while (i < n)
        colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors;
};
var schemeCategory10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");
var scale = (0, d3_scale_1.scaleOrdinal)(schemeCategory10);
var toLabel = function (text) {
    var spaced = text.replace(/([A-Z])/g, ' $1');
    var capped = spaced.charAt(0).toUpperCase() + spaced.slice(1);
    var shrunk = capped.replace(' Per One ', '/');
    return shrunk.replace(/(Today)\s(\w+)/, '$2 $1');
};
function HeatMap() {
    var mapRef = (0, react_1.useRef)();
    var _a = __read((0, react_1.useState)(null), 2), hoverInfo = _a[0], setHoverInfo = _a[1];
    var _b = __read((0, react_1.useState)({ json: undefined, dimensionMap: undefined }), 2), allData = _b[0], setAllData = _b[1];
    var _c = __read((0, react_1.useState)({
        value: "cases",
        label: 'Cases',
        color: '#1f77b4',
    }), 2), dimension = _c[0], setDimension = _c[1];
    (0, react_1.useEffect)(function () {
        console.log("fetching new data");
        /* global fetch */
        fetch('https://raw.githubusercontent.com/purvasingh96/Mapbox-react-app/main/src/data/COVID.json')
            .then(function (resp) { return resp.json(); })
            .then(function (json) { return setAllData({ json: json, dimensionMap: splitDimensions(json) }); })
            .catch(function (err) { return console.error('Could not load data', err); }); // eslint-disable-line
    }, []);
    var data = (0, react_1.useMemo)(function () {
        console.log("memoized data");
        return allData;
    }, [allData]);
    var quantizeOpacity = function (dimz) {
        //console.log("dimension: ", dimz);
        var domain = [];
        var fillOpacity;
        allData.json.features.forEach(function (f) {
            domain.push(f.properties[dimz.value]);
        });
        // extent: calculates min and max in an array
        if ((0, d3_array_1.extent)(domain)[0] === (0, d3_array_1.extent)(domain)[1]) {
            fillOpacity = 0.2;
        }
        else {
            var opacity = (0, d3_scale_1.scaleQuantize)()
                .domain((0, d3_array_1.extent)(domain))
                .range([0.2, 0.35, 0.5, 0.65, 0.8]);
            fillOpacity = [
                'step',
                ['get', dimz.value],
                0.1,
                opacity.invertExtent(0.2)[0],
                0.2,
                opacity.invertExtent(0.35)[0],
                0.35,
                opacity.invertExtent(0.5)[0],
                0.5,
                opacity.invertExtent(0.65)[0],
                0.65,
                opacity.invertExtent(0.8)[0],
                0.8,
            ];
        }
        return fillOpacity;
    };
    //  console.log("allData.dimensionMap beofre seting dimension: ", allData.dimensionMap);
    var onHover = (0, react_1.useCallback)(function (event) {
        var features = event.features, _a = event.point, x = _a.x, y = _a.y;
        var hoveredFeature = features && features[0];
        console.log(hoveredFeature);
        // prettier-ignore
        setHoverInfo(hoveredFeature && { feature: hoveredFeature, x: x, y: y });
    }, []);
    function splitDimensions(allData) {
        var index = 0;
        var dimensionsMap = new Map();
        Object.keys(allData.features[0].properties).forEach(function (d) {
            if (!legendItems.includes(d)) {
                var label = toLabel(d);
                var color = scale(index.toString());
                dimensionsMap.set(d, { label: label, color: color });
                index++;
            }
        });
        if (dimensionsMap) {
            setDimension({
                value: dimensionsMap.keys().next().value,
                label: dimensionsMap.values().next().value.label,
                color: dimensionsMap.values().next().value.color,
            });
        }
        return dimensionsMap;
    }
    ;
    var heatmapLayer;
    if (allData.dimensionMap) {
        heatmapLayer = {
            id: 'data',
            type: 'fill',
            source: 'polygons',
            paint: {
                "fill-outline-color": "black",
                'fill-color': allData.dimensionMap.get(dimension.value).color,
                'fill-opacity': quantizeOpacity(dimension)
            }
        };
    }
    return (React.createElement(react_map_gl_1.default, { initialViewState: {
            latitude: 40,
            longitude: -100,
            zoom: 3
        }, style: { width: '90vw', height: '80vh' }, mapStyle: "mapbox://styles/mapbox/light-v9", mapboxAccessToken: MAPBOX_TOKEN, interactiveLayerIds: ['data'], onMouseMove: onHover, renderWorldCopies: false }, data.json && (React.createElement(React.Fragment, null,
        React.createElement(react_map_gl_1.Source, { type: "geojson", data: data.json },
            React.createElement(react_map_gl_1.Layer, __assign({}, heatmapLayer))),
        hoverInfo && dimension && (React.createElement("div", { className: "tooltip", style: { left: hoverInfo.x, top: hoverInfo.y } },
            React.createElement("div", null,
                "State: ",
                hoverInfo.feature.properties.name),
            React.createElement("div", null,
                "Population:",
                ' ',
                hoverInfo.feature.properties.population.toLocaleString()),
            React.createElement("div", null,
                allData.dimensionMap.get(dimension.value).label,
                ":",
                ' ',
                hoverInfo.feature.properties[dimension.value].toLocaleString()),
            React.createElement("div", null,
                "Updated:",
                ' ',
                (0, date_fns_1.format)(hoverInfo.feature.properties.updated, 'MMM d yyyy')))),
        dimension && React.createElement(heatmap_control_panel_1.default, { name: "COVID-19 State-By-State Daily Statistic Heatmap Layer", dimensions: data.dimensionMap, onChange: function (e) {
                setDimension({
                    value: e.toLocaleString(),
                    label: allData.dimensionMap.get(e.toLocaleString()).label,
                    color: allData.dimensionMap.get(e.toLocaleString()).color,
                });
            } })))));
}
exports.default = HeatMap;
// export function renderToDom(container) {
//   render(<HeatMap />, container);
// }
//# sourceMappingURL=heatmap.js.map