"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderToDom = void 0;
var React = require("react");
var react_dom_1 = require("react-dom");
var heatmap_1 = require("./heatmap/heatmap");
function renderToDom(container) {
    (0, react_dom_1.render)(React.createElement(heatmap_1.default, null), container);
}
exports.renderToDom = renderToDom;
// export function renderToDom(container) {
//   render(<HeatMap />, container);
// }
//# sourceMappingURL=app.js.map