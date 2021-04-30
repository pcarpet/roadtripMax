import './App.css';
import React from 'react';
import SplitPane, { Pane } from 'react-split-pane';
import Carte from './components/carte'
import ListItineraire from './components/listItineraire'
import { Text,Button, StyleSheet } from "react-native";
import {List} from 'immutable';

const stylesSpliter = {
  background: '#000',
  width: '2px',
  cursor: 'col-resize',
  margin: '0 5px',
  height: '100%',
};

const listV=[

 {title: 'Mardi 5 octobre 2021', data: [{'ville':'Paris','lat':48.866667,'long':2.333333,'id':1,'selected':false}, {'ville':'Versailles','lat':48.801408,'long':2.130122,'id':2,'selected':false}, {'ville':'Rambouillet','lat':	48.643868,'long':1.829079,'id':3,'selected':false} ]},
{title: 'Mercredi 6 octobre 2021', data: [{'ville':'Chartres','lat':48.443854,'long':1.489012,'id':4,'selected':false}, {'ville':'Châteaudun','lat':48.0708,'long':1.3237,'id':5,'selected':false}, {'ville':'Le mans','lat':48.00611,'long':0.199556,'id':6,'selected':false}, {'ville':'Angers','lat':47.478419,'long':-0.563166,'id':7,'selected':false} ]},

];





class App extends React.Component {
	
	constructor(props){
		super(props);
		this.state={position:[48.85, 2.33],zoom:11};
		this.onSelection=this.onSelection.bind(this);
		this.addItem = this.addItem.bind(this);
	}
	onSelection(id){
		console.log("onselection "+id);
		for(var i=0;i<listV.length;i++){
			for(var j=0;j<listV[i].data.length;j++){
				//console.log("tabid "+this.list[i].data[j].id);
			
				if(listV[i].data[j].id===id){
					//this.position=[listV[i].data[j].lat,listV[i].data[j].long];
					console.log({position:[listV[i].data[j].lat,listV[i].data[j].long]});
					var tab=new List([listV[i].data[j].lat,listV[i].data[j].long]);
					this.setState({position:[listV[i].data[j].lat,listV[i].data[j].long]},console.log("new pos ok " ));
					//this.setState(() => ({ position: tab }));
				}
			
			}
		}
	}
	
	render(){
	    return (
	      <div className="App">
	  	  <SplitPane split="vertical" allowResize="true" defaultSize="50%" resizerStyle={stylesSpliter}>
			<Pane className="CarteList">
					<form onSubmit={this.addItem}>
						<input placeholder="enter task">
						</input>
						<button type="submit">add</button>
					</form>
	  			  <ListItineraire list={listV} selection={this.onSelection} />
	  	    </Pane>
			<Pane  className="CarteMod">
				<Button title="Dezoom" color="#005500" onPress={() => this.setState({zoom:8}) } />
					<Text >Before Position: {this.state.position[0]} , {this.state.position[1]} </Text>
				<Carte list={listV} center={this.state.position} zoom={this.state.zoom} />
	  	  	</Pane>
	  	   
	  	  </SplitPane>
      
	      </div>
	    );
	}
  
}

export default App;
