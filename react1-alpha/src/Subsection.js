import React from 'react'
import './App.css'

class Subsection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      parsedTime: this.parseTimes(this.props.data.time),
  }; }

  parseTimes(data){
    var toReturn = [];
    for (var key in data) {
      // check if the property/key is defined in the object itself, not in parent
      if (data.hasOwnProperty(key)) { 
          toReturn.push(key + ": " + data[key], <br key={this.props.id + ";" + this.props.data.number + ";" + key + ": " + data[key]}></br>)
      }
    }

    return toReturn;
  }
	
	render() {
		return (
			<React.Fragment>
				<tr>
          <td style={{padding: "15px"}}> {this.props.data.number} </td>
          <td> {this.props.data.instructor} </td>
          <td> {this.props.data.location} </td>
          <td> {this.state.parsedTime}</td>
          <td> <button className={"addBtn"} onClick={() => this.props.subSectionCallback(this.props.id + ";" + this.props.data.number)}>{this.props.cartMode? "Remove Subsection" : "Add Subsection"}</button> </td>
				</tr>
				
			</React.Fragment>
		)
	}
}

export default Subsection;