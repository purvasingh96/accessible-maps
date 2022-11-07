import * as React from 'react';
import { render } from 'react-dom';
import HeatMap from './heatmap/heatmap';
export function renderToDom(container) {
    render(React.createElement(HeatMap, null), container);
}
// export function renderToDom(container) {
//   render(<HeatMap />, container);
// }
//# sourceMappingURL=app.js.map