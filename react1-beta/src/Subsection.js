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

  changeBg(){
    // update the new color if courses added
    document.getElementById("cartBg").style.background = "#dadfe1";
  }
	
	render() {
		return (
			<React.Fragment>
				<tr>
          <td class="pl-4 small"> {this.props.data.number} </td>
          <td class="small" style={{display: this.props.cartMode ? "none": ""}}> {this.props.data.instructor} </td>
          <td class="small" style={{display: this.props.cartMode ? "none": ""}}> {this.props.data.location} </td>
          <td class="small"> {this.state.parsedTime}</td>
          <td> <button className="rounded bg-light secondary font-weight-bold mx-auto" onClick={() => {this.props.subSectionCallback(this.props.id + ";" + this.props.data.number); this.changeBg();}}>{this.props.cartMode? "Remove Section" : "Add Section"}</button> </td>
				</tr>
				
			</React.Fragment>
		)
	}
}

export default Subsection;