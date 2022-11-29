import React from "react";
import {createRoot} from 'react-dom/client';
import Heatmap from "./Heatmap/heatmap";
import { Routes, Route, HashRouter as Router, Navigate} from "react-router-dom";
import Navbarcustom from "./Navbar/navbar";
import { BASE_PATH, DATA_URL_HEATMAP, DATA_URL_MAP1, DATA_URL_MAP2, DATA_URL_MAP3, DATA_URL_MAP4, GEOJSON_URL_HEATMAP, GEOJSON_URL_MAP1, GEOJSON_URL_MAP2, GEOJSON_URL_MAP3, GEOJSON_URL_MAP4, GEOJSON_URL_PLAYGROUND, IFRAME_URL_AUDIOM_MAP1, IFRAME_URL_AUDIOM_MAP2, IFRAME_URL_AUDIOM_MAP3, IFRAME_URL_AUDIOM_MAP4 } from "./constants/constants";
import AccessibleTables from "./Tables/accessible-tables";
import Playground from "./Playground/playground";
import { Container } from "react-bootstrap";
import Audiom from "./Audiom/audiom";

function App() {
    console.log('inside app');
    return (
        <div>
        <Router>
          <Navbarcustom/>
          <Routes>
          <Route path="/" 
          element={<Heatmap geojsonUrl={GEOJSON_URL_HEATMAP} dataUrl={DATA_URL_HEATMAP}/>} />
          <Route path={"/maps/playground"} 
          element={<Playground geojsonUrl={GEOJSON_URL_PLAYGROUND}/>} />
          <Route path={"/maps/heatmap"} 
          element={<Heatmap geojsonUrl={GEOJSON_URL_HEATMAP} dataUrl={DATA_URL_HEATMAP}/>} />
          <Route path="/maps/map1" 
          element={<Heatmap geojsonUrl={GEOJSON_URL_MAP1} dataUrl={DATA_URL_MAP1}/>} />
            <Route path="/maps/map2" 
          element={<Heatmap geojsonUrl={GEOJSON_URL_MAP2} dataUrl={DATA_URL_MAP2}/>} />
          <Route path="/maps/map3" 
          element={<Heatmap geojsonUrl={GEOJSON_URL_MAP3} dataUrl={DATA_URL_MAP3}/>} />
          <Route path="/maps/map4" 
          element={<Heatmap geojsonUrl={GEOJSON_URL_MAP4} dataUrl={DATA_URL_MAP4}/>} />

          <Route path="/tables/table1" 
          element={<AccessibleTables dataUrl={DATA_URL_MAP1} />} />
          <Route path="/tables/table2" 
          element={<AccessibleTables dataUrl={DATA_URL_MAP2} />} />
          <Route path="/tables/table3" 
          element={<AccessibleTables dataUrl={DATA_URL_MAP3} />} />
          <Route path="/tables/table4"
          element={<AccessibleTables dataUrl={DATA_URL_MAP4} />} />


          <Route path="/audiom/map1" 
          element={<Audiom iframeUrl={IFRAME_URL_AUDIOM_MAP1}/>} />
          <Route path="/audiom/map2" 
          element={<Audiom iframeUrl={IFRAME_URL_AUDIOM_MAP2}/>} />
          <Route path="/audiom/map3" 
          element={<Audiom iframeUrl={IFRAME_URL_AUDIOM_MAP3}/>} />
          <Route path="/audiom/map4"
          element={<Audiom iframeUrl={IFRAME_URL_AUDIOM_MAP4}/>} />
  
            {/* 👇️ only match this when no other routes match */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Router>
        </div>
        );
}

const container = document.getElementById('map');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App/>);
