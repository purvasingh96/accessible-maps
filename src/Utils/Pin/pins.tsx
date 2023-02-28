import { Marker, Popup } from 'react-map-gl';
import * as React from 'react';
import {useState, useMemo} from 'react';
import Pin from './pin';

type pinsProps = {
    json:any;
    hoverInfo:any;
    dimensionMap:any;
    dimension:any;
}

interface Point {
    longitude: number;
    latitude: number;
  }
  
  function calculateCentroid(points: Point[]): Point {
    let centroid: Point = { longitude: 0, latitude: 0 };
    let signedArea = 0.0;
    let x0 = 0.0;
    let y0 = 0.0;
    let x1 = 0.0;
    let y1 = 0.0;
    let a = 0.0;

    let p : Point[]=[];

    for (let i = 0; i < points.length; i++){
        const point: Point = {
            longitude: points[i][0],
            latitude: points[i][1]
        }
        p.push(point);
    }    
  
    for (let i = 0; i < p.length; i++) {
      
      x0 = p[i].longitude;
      y0 = p[i].latitude;
      x1 = p[(i + 1) % points.length].longitude;
      y1 = p[(i + 1) % points.length].latitude;
      a = x0 * y1 - x1 * y0;
      signedArea += a;
      centroid.longitude += (x0 + x1) * a;
      centroid.latitude += (y0 + y1) * a;
    }
  
    signedArea *= 0.5;
    centroid.longitude /= (6.0 * signedArea);
    centroid.latitude /= (6.0 * signedArea);
    return centroid;
  }

export default function Pins(props:pinsProps) {
    const [popupInfo, setPopupInfo] = useState(null);
    const pins = useMemo(
        () =>
          props.json.features.map((coords) => (
            <Marker
              longitude={calculateCentroid(coords.geometry.coordinates[0]).longitude}
              latitude={calculateCentroid(coords.geometry.coordinates[0]).latitude}
              anchor="bottom"
                onClick={e => {
                    e.originalEvent.stopPropagation();
                    setPopupInfo(coords);
                }}
            >
              <Pin />
            </Marker>
          )),
        []
      );


    return(
        <>
        {pins}
        {popupInfo && props.hoverInfo && props.dimension && <Popup
        anchor='top'
        longitude={calculateCentroid(popupInfo.geometry.coordinates[0]).longitude}
        latitude={calculateCentroid(popupInfo.geometry.coordinates[0]).latitude}
        onClose={() => setPopupInfo(null)}
        >
        <div>
            <div>State: {props.hoverInfo.feature.properties.name}</div>
            <div>
                Population:{' '}
                {props.hoverInfo.feature.properties.population.toLocaleString()}
            </div>
            <div>
                {props.dimensionMap.get(props.dimension.value).label}:{' '}
                {props.hoverInfo.feature.properties[props.dimension.value].toLocaleString()}
            </div>
        </div>
        </Popup>}
        </>
    )

}