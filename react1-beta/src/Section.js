import React from 'react'
import './App.css'
import Subsection from './Subsection.js'

class Section extends React.Component {
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
        toReturn.push(key + ": " + data[key], <br key={this.props.id + ";" + key + ": " + data[key]}></br>)
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
        <tr class="back-primary">
          <td class="small"> {this.props.data.number} </td>
          <td class="small" style={{display: this.props.cartMode ? "none": ""}}> {this.props.data.instructor} </td>
          <td class="small" style={{display: this.props.cartMode ? "none": ""}}> {this.props.data.location} </td>
          <td class="small" > {this.state.parsedTime}</td>
          <td class="p-auto "> <button className="rounded bg-light secondary font-weight-bold mx-auto" onClick={() => {this.props.sectionCallback(this.props.id); this.changeBg();}}>{this.props.cartMode? "Remove Lecture" : "Add Lecture"}</button> </td>
        </tr>
				
				{/* subsections */}
				{this.props.data.subsections.map(curSubsection => (
					<Subsection key={this.props.id + curSubsection.number} data={curSubsection} subSectionCallback={this.props.subSectionCallbackPass1} cartMode={this.props.cartMode} id={this.props.id}/>
          ))}
				
			</React.Fragment>
		)
	}
}

export default Section;