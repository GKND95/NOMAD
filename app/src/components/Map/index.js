import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { _Context } from '../../App';
import lightingEffect from './lighting';
import FilterBar from './FilterBar';
import { useMode, useLayers } from './hooks';
import { defaultViewState } from './helpers';
import { renderLocation } from './layers';
import { ALL_COUNTRIES } from '../../data';

import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';

function processData(data) { 
  return data.map(i => ({
    id: i.id,
    latitude: i.y,
    longitude: i.x,
    value: i.slope,
    tmin: i.tmin_2100,
    tmax: i.tmax_2100
  }))
}

const API_URL = process.env.NODE_ENV === "development" ?
  "http://localhost:4000/api" : "/api";

const Map = () => {
  const [ data, setResults ] = useState([]);
  const [ filterMode, setFilterMode ] = useState('temp');
  const { state } = useContext(_Context);

  const { country, region, land, bumpy, temperature, water } = state;
  const [ viewState, mode ] = useMode(country, region);

  useEffect(() => {
    country && fetchData()
  }, [ country, land, bumpy, temperature ]);

  const fetchData = async () => {
    const result = await axios.get(API_URL, {
      params: state
    }); 
    const parsed = processData(result.data);
    setResults(parsed);
  };

  const waterData = data.filter((i, key) =>
    ( 
      (key % (water[0] - water[1])) >= 0 && 
      (key % (water[0] - water[1])) <= 10
    )
  );

  const layers = useLayers(mode, waterData, filterMode);
  const locationLayer = country ?
    renderLocation(ALL_COUNTRIES[country].coordinates) : [];

  return (
    <>
      { country && (
        <FilterBar 
          setFilterMode={ setFilterMode }
          filterMode={ filterMode }
          show={ mode === 'country' }
        />
      ) }
      <DeckGL
        effects={[lightingEffect]}
        initialViewState={ defaultViewState }
        viewState={ viewState }
        controller={true}
        layers={ [
          ...locationLayer, 
          ...layers
        ] }
      >
        <StaticMap 
          reuseMaps
          mapStyle={'mapbox://styles/mapbox/light-v10?optimize=true'}
          preventStyleDiffing={true}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          maxZoom
          flyToOptions={{
            speed: 0.8
          }}
        />
      </DeckGL>
    </>
  )
}

export default Map;