import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
require('dotenv').config()

function Map ({markerPosition, showMarker, clientClick, handleClick}) {

    console.log(markerPosition)

    const defaultCenter = { lat: 31.45, lng: 35 }

    const InitMap = withScriptjs (withGoogleMap (props  => 
        <GoogleMap
            defaultZoom={7.4}
            defaultCenter={defaultCenter}
            onClick={(e)=>handleClick(e)}
            options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    styles: [{
                        featureType: "all",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }],
                    }]
              }}>
            {showMarker && <Marker position={props.marker}/>}
            <Marker position={clientClick} icon='http://maps.google.com/mapfiles/ms/icons/green-dot.png'/>
        </GoogleMap>
    ))   

  

    return (
        <InitMap 
        marker={markerPosition}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.MAP_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }}/>}
        containerElement={<div style={{ height: `650px`, width: '300px' }} />}
        mapElement={<div style={{ height: `600px` }} />}
        />
    )  
}

export default Map
