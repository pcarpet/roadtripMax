import React from 'react';
import firebase from "../firebase.js";
import SplitPane, { Pane } from 'react-split-pane';
import moment from "moment";
import ListEtape from './time/ListEtape'
import StepFinder from './Stepfinder'
import Carte from './space/Carte'
import {Button} from "antd";

const stylesSpliter = {
  background: '#000',
  width: '2px',
  cursor: 'col-resize',
  margin: '0 5px',
  height: '100%',
};


class Core extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listV: [
        {
          key: 1,
          rank: 1,
          activityType: "travel",
          date: moment("2021-08-07", "YYYY-MM-DD"),
          googleFormattedAdress: "Terminal 2, France",
          googlePlaceId: "ChIJ7-sXgBkW5kcRFVrnq-iDYGY",
          lat: 49.0049612,
          long: 2.5907692,
          nomEtape: "Embarquement CDG",
          price: "200",
          selected: false,
        },
        {
          key: 2,
          rank: 2,
          activityType: "hotel",
          date: moment("2021-08-07", "YYYY-MM-DD"),
          googleFormattedAdress: "Via Fabio Filzi, 43, 20124 Milano MI, Italie",
          googlePlaceId: "ChIJLT2PgNDGhkcR8JLKbYe11Us",
          lat: 45.487847,
          long: 9.202771799999999,
          nomEtape: "Hotel 43 Station",
          price: "140",
          selected: false,
        },

        {
          key: 3,
          rank: 3,
          activityType: "activity",
          date: moment("2021-08-08", "YYYY-MM-DD"),
          googleFormattedAdress: "P.za del Duomo, 20122 Milano MI, Italie",
          googlePlaceId: "ChIJoTZGw67GhkcREy4aECdOf6s",
          lat: 45.4640976,
          long: 9.1919265,
          nomEtape: "Messe au duomo",
          price: undefined,
          selected: false,
        },
        {
          key: 4,
          rank: 4,
          activityType: "hotel",
          date: moment("2021-08-08", "YYYY-MM-DD"),
          googleFormattedAdress: "Via Fabio Filzi, 43, 20124 Milano MI, Italie",
          googlePlaceId: "ChIJLT2PgNDGhkcR8JLKbYe11Us",
          lat: 45.487847,
          long: 9.202771799999999,
          nomEtape: "Hotel 43 Station",
          price: undefined,
          selected: false,
        },
        {
          key: 5,
          rank: 5,
          activityType: "travel",
          date: moment("2021-08-09", "YYYY-MM-DD"),
          googleFormattedAdress:
            "Piazza Quattro Novembre, 2, 20124 Milano MI, Italie",
          googlePlaceId: "ChIJxWybptrGhkcRx5uwoz8FmK0",
          lat: 45.486515,
          long: 9.2033177,
          nomEtape: "Location Fiat 500",
          price: 500,
          selected: false,
        },
      ],
      focusOnPolylineId: undefined,
      mapKey: 0,
      position: [48.85, 2.33],
      zoom: 11,
      lastDate: moment(),
    };
    this.addEtape = this.addEtape.bind(this);
    this.selectEtape = this.selectEtape.bind(this);
    this.setCalculatedDirection = this.setCalculatedDirection.bind(this);
    this.saveList = this.saveList.bind(this);

const itemsRef = firebase.database().ref("activities");
 console.log(itemsRef);
    
    itemsRef.on("value", (snapshot) => {
  let items = snapshot.val();
  console.log("retrieve from db :");
  console.log(items);
});

  }


  saveList() {
    const activitiesRef = firebase.database().ref("activities");
    const item = {
      title: "Bonjour",
      user: "Pierre",
    };
    const saveditem = activitiesRef.push(item);
    console.log(saveditem);
  }

  /* Ajoute l'étape remontée par le composant StepFinder à la liste*/
  addEtape(etape) {
    console.log("Nouvelle etape key : " + etape.key);
    var listLocal = this.state.listV;
    // Ajout de l'étape à la liste
    listLocal.push(etape);

    //Tri des étapes par chronologie
    listLocal.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      if (a.date - b.date === 0) {
        return a.heure - b.heure;
      };
      return a.date - b.date;
    });
    //Recalcul du rank (ben c'est mieu que la position dans un array)
    for (var i = 0; i < listLocal.length; i++) {
      listLocal[i].rank = i + 1;
    }

    //Récupération de la date la plus ancienne
    this.setState({ lastDate: listLocal[listLocal.length].date });

    this.setState({ listV: listLocal });
    //On centre la carte sur la nouvelle étape
    this.selectEtape(etape.key);
  }

  /* Déclanchement de la sélection d'un étape */
  selectEtape(idEtape) {
    var selectionList = this.state.listV;
    for (const ligne of selectionList) {
      if (ligne.key === idEtape) {
        ligne.selected = true;
      } else {
        ligne.selected = false;
      }
    }

    this.setState({ ListV: selectionList });

    console.log("onselection " + idEtape);
    const listV = this.state.listV;
    for (const etape of listV) {
      //Mise à jour de la position de la carte
      if (etape.key === idEtape) {
        this.setState({ position: [etape.lat, etape.long] });
      }
    }
  }

  //Ajouter l'itinéraire calculé dans le ListeEtape entre 2 étapes (rattaché l'étape de départ)
  setCalculatedDirection(key, directionsResult) {
    var listLocal = this.state.listV;
    const index = listLocal.findIndex((etape) => etape.key === key);
    listLocal[index].directionsResult = directionsResult;
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.focusOnPolylineId = key;
    this.setState({ ListV: listLocal });
    //FIXME : Si je ne fait pas un setState du Zoom le polyline avec le directionResult ne s'affiche pas sur la carte
    this.setState({ mapKey: this.state.mapKey + 1 });
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.focusOnPolylineId = undefined;
  }

  render() {
    return (
      <div className="Core">
        <p>
          <Button type="primary" onClick={() => this.saveList()}>
            {" "}
            SAVE LIST{" "}
          </Button>
        </p>
        <div className="StepFinder">
          <StepFinder addEtape={this.addEtape} lastDate={this.lastDate} />
        </div>
        <SplitPane
          split="vertical"
          allowResize={true}
          defaultSize="50%"
          resizerStyle={stylesSpliter}
        >
          <Pane className="CarteList">
            <ListEtape
              listV={this.state.listV}
              selectEtape={this.selectEtape}
              setCalculatedDirection={this.setCalculatedDirection}
            />
          </Pane>
          <Pane className="CarteMod">
            {/* <Button
                title="Dezoom"
                color="#005500"
                onPress={() => this.setState({ zoom: 8 })}
              />
              <Text>
                Before Position: {this.state.position[0]} ,{" "}
                {this.state.position[1]}{" "}
              </Text> */}
            <Carte
              mapKey={this.state.mapKey}
              activitiesList={this.state.listV}
              focusOnPolylineId={this.state.focusOnPolylineId}
              center={this.state.position}
              zoom={this.state.zoom}
            />
          </Pane>
        </SplitPane>
      </div>
    );
  }
}


export default Core;
