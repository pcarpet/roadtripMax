import React from 'react';
import Marker from './Marker'
import GoogleMapReact from 'google-map-react'; //https://github.com/google-map-react/google-map-react
import shouldPureComponentUpdate from 'react-pure-render/function';
const decodePolyline = require("decode-google-map-polyline");


class Carte extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      mapsLoaded: false,
      map: null,
      maps: null,
      GMAPS_API_KEY: "AIzaSyCsEisE6ttI_E8imbal3A4PdXJkLf9a0zc",
      polylines : [],
      options : {
        styles: [{
          featureType: "poi",
          elementType: "labels",
          stylers: [
            { visibility: "on" }
          ]
        }]
      /*   mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: google.maps.ControlPosition.TOP_RIGHT
        } */
      },
      mapOptions : {
        mapId: 'e8fbc944e4790e01'
        /* fullscreenControl: false,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false, */
      }
    };
  }




  onMapLoaded(map, maps) {
    this.fitBounds(map, maps);

    console.log("Map loaded");

    this.setState({
      // Je commente car je sais pas à quoi ca sert:
      // ...this.state,
      mapsLoaded: true,
      map: map,
      maps: maps,
    });
  }

  fitBounds(map, maps) {

    if (maps === undefined || maps == null) { return;}

    let activities = this.props.activitiesList;   


    var bounds = new maps.LatLngBounds();
    if(activities.length ===0){
      // C'est la FRANCE monsieur
      let initMapsZone = [{lat: 50.802448,long:-4.947507},
                          {lat: 42.559802,long:-4.947507},
                          {lat: 50.802448,long:8.432071197773451},
                          {lat: 42.559802,long:8.432071197773451}]
      for (let place of initMapsZone) {
        bounds.extend(new maps.LatLng(place.lat, place.long));
      }
    }else{

      //Si il y a une activité sélectioné on zoom dessus
     if(activities.find(a => a.selected) !== undefined){
        activities = activities.filter(a => a.selected);
      } 

      for (let place of activities) {
        bounds.extend(new maps.LatLng(place.origin.lat, place.origin.long));
      }
    }
    map.fitBounds(bounds);
  }

  _onClick({ x, y, lat, lng, event }) {
    console.log(x, y, lat, lng, event);
    console.log("Is event:" + "placeId" in event)
    

  }


  displayActivityOnMap(place){

      console.log('place', place);

    

     return (
          <Marker 
              key={place.key} 
              lat={place.origin.lat} lng={place.origin.long}
              text={place.startDate.locale('fr').format("ddd DD/MM - hh:mm","fr")}
              isActive={place.selected}
            />
      )

  }

  //FIXME : Attention la méthode est appelée 2x
  displayDirectionsOnMap = (act) => {

    const routes = act
        .filter(act => act.route !== undefined && act.route !== null)
        .map(act => {
          const key  = act.route.geocoded_waypoints[0].place_id + act.route.request.travelMode + act.route.geocoded_waypoints[1].place_id ;
          return {key: key, value: act.route};
        });
    
        
    let polylines = this.state.polylines;
    //Polyline à supprimer
    for(const [key, value] of Object.entries(polylines)){
      if(routes.find(r => r.key === key) === undefined){
        //console.log('supression du polyline: ' + key);
        value.setMap(null);
      }
    }
    
    
    //création des Polyline

    for(const route of routes){
      console.log(route.key)

      if(polylines[route.key] === undefined){
        //console.log("Création d'un nouveau polyline")
        let path = decodePolyline(route.value.routes[0].overview_polyline);
        let polyline = this.renderPolylines(this.state.maps,path);
        if(polyline ==! null){
          polylines[route.key] = polyline;
          polylines[route.key].setMap(this.state.map);
        }
      }
    }
    
    //this.setState({polylines : polylines})

  }

  renderPolylines = (maps, path) => {

    if (maps === undefined || maps == null) { return null;}

    let nonGeodesicPolyline = new maps.Polyline({
      path: path,
      geodesic: false,//rendering non geodesic polyline (straight line)
      strokeColor: '#0000f0e4',
      strokeOpacity: 0.7,
      strokeWeight: 3
    });

    return nonGeodesicPolyline;
  }


  onMapChange() {
    console.log("MAP mise à jours");
    this.fitBounds(this.state.map, this.state.maps);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "85vh", width: "100%" }}>
        <GoogleMapReact
          //key={this.props.mapKey}
          bootstrapURLKeys={{
            key: this.state.GOOGLE_MAPS_API,
            language: "fr",
            region: "fr_FR",
          }}
          options={this.state.mapOptions}
          center={[48.85, 2.33]}
          zoom={11}
          yesIWantToUseGoogleMapApiInternals={true}
          onGoogleApiLoaded={({ map, maps }) => this.onMapLoaded(map, maps)}
          onChange={this.onMapChange()}
          onBoundsChange={this._onBoundsChange}
          //onChildClick={this._onChildClick}
          onClick={this._onClick}
          onChildMouseEnter={this._onChildMouseEnter}
          onChildMouseLeave={this._onChildMouseLeave}

        >
          {this.props.activitiesList.map(place => this.displayActivityOnMap(place))}
          {this.displayDirectionsOnMap(this.props.activitiesList)}
        </GoogleMapReact>
      </div>
    );
  }
}
export default Carte
