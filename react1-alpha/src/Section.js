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

	render() {
		return (
			<React.Fragment>
        <tr style={{backgroundColor: 'lightGrey'}}>
          <td> {this.props.data.number} </td>
          <td> {this.props.data.instructor} </td>
          <td> {this.props.data.location} </td>
          <td> {this.state.parsedTime}</td>
          <td> <button className={"addBtn"} onClick={() => this.props.sectionCallback(this.props.id)}>{this.props.cartMode? "Remove Section" : "Add Section"}</button> </td>
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