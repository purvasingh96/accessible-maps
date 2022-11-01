import * as React from 'react';
import {render} from 'react-dom';
import PlaygroundApp from "./playground/playground";
import HeatMap from './heatmap/heatmap';


export function renderToDom(container) {
  
    render(

  
    
    <HeatMap />
  
  , container);
    
  }

// export function renderToDom(container) {
//   render(<HeatMap />, container);
// }