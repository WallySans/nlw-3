import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {FiPlus,FiArrowRight} from 'react-icons/fi';
import Switch from 'react-switch';

import '../styles/pages/orphanages-map.css';

import {Map,TileLayer, Marker,Popup} from 'react-leaflet';

import mapMarkerImg from '../imgs/map-marker.svg';
import mapIcon from '../utils/mapIcon';
import api from '../services/api';

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [mapModeSwitch, setMapModeSwitch] = useState<boolean>(false);
  const [mapMode, setMapMode] = useState<string>('light');

  useEffect(() => {
    api.get('/orphanages').then(response => {
      setOrphanages(response.data);
    })
  }, []);

  function handleChangeModeMap() {
    if(mapModeSwitch){
      setMapModeSwitch(false)
      setMapMode('light');
    }else {
      setMapModeSwitch(true);
      setMapMode('dark');
    }
  }

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy"/>
          <h2>Escolha um orfanato no mapa.</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>
        <footer>
          <strong>Goias</strong>
          <span>Anápolis</span>
        </footer>
        <label>
          <span>Mapa versão noturna</span><br/>
          <Switch 
            onChange={handleChangeModeMap} 
            checked={mapModeSwitch} 
            uncheckedIcon
          />
        </label>
      </aside>
      
      <Map 
        center={[-16.3035958,-48.9482241]} 
        zoom={15}
        style= {{width:'100%', height: '100%'}}
      >
        <label className="switch">

        </label>
        {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />  */}
        <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/${mapMode}-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />
        {orphanages.map(orphanage => {
          return (
            <Marker
            key={orphanage.id}
            position={[orphanage.latitude,orphanage.longitude]} 
            icon={mapIcon}
          >
            <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
              {orphanage.name}
              <Link to={`/orphanages/${orphanage.id}`}>
                <FiArrowRight size={20} color= "#FFF"/>
              </Link>
            </Popup>
          </Marker>
          )
        })}

      </Map>

        <Link to="/orphanages/create" className="create-orphanage">
          <FiPlus size={32} color="#FFF" />
        </Link>
      
    </div>
  );
}

export default OrphanagesMap;