import React from 'react';
import "./etape.scss";
import { Row, Col, Tooltip, Button, Typography} from "antd";
import { CompassOutlined } from "@ant-design/icons";
import Emoji from "a11y-react-emoji";

const { Paragraph } = Typography;  

class Etape extends React.Component{
	constructor(props){
		super(props);

    this.state = { key: this.props.data.key, etapeLocal: this.props.data, };
    this.onClickItem = this.onClickItem.bind(this);
    this.onClickDirection = this.onClickDirection.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onActivityNameChange = this.onActivityNameChange.bind(this);
    this.getMidi = this.getMidi.bind(this);
  }


	onClickItem(){
			console.log("Click sur l'item" + this.state.key);
			this.props.cbBg(this.state.key);
			//console.log(e.nativeEvent.srcElement.innerText);		
  }
  
  onClickDirection() {
    this.props.getStepToStepDirection(this.state.key);
  }

  onClickDelete(){
    this.props.deleteActivity(this.state.key);
  }
	
  getEmoji(value) {
    switch (value) {
      case 'travel':
        return "✈️";
      case 'hotel':
        return "🛏️";
      case 'activity':
        return "🎾";
      case 'resto':
        return "🍽️";
      default:
        console.error(`Sorry, we are out of ${value}.`);
    }
  }

  onActivityNameChange(newName){
    var etape = this.state.etapeLocal;
    etape.nomEtape = newName;
    this.setState({etapeLocal : etape});
  }

  getMidi(dayActivite){
    console.log(dayActivite)
    console.log(dayActivite.find(e => e.activityType === 'travel'))
    return dayActivite.find(e => e.activityType === 'travel') ? dayActivite.find(e => e.activityType === 'travel').nomEtape : 'Midi';
  }

	render(){
		return (
      <div className="leaderboard__profile" onClick={this.onClickItem}>
        <Row>
          <Col span={7}>
            Matin
          </Col>
          <Col span={3}>
            {this.getMidi(this.props.data)}
          </Col>
          <Col span={7}>
           Aprem
          </Col>
          <Col span={3}>
            Dinner
          </Col>
          <Col span={4}>
            Hotel
          </Col>
        </Row>
      </div>
    );
	}
}

export default Etape;
