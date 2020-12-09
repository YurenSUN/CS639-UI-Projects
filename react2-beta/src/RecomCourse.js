import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';

class RecomCourse extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Card class="m-1 p-0 bg-light rounded">
					<Card.Body >
						<h4 class="mt-0">
							{this.props.data.number}: {this.props.data.name}
						</h4>
						<p style={{ display: (this.props.interests !== "") ? "block" : "none" }}>
							Recommend this because you have gave high rating to course(s) with keyword(s):
							{this.props.interests}
						</p>

						<p style={{ display: (this.props.wishList !== "") ? "block" : "none" }}>
							Recommend this because this course
							{this.props.wishList}
						</p>

						<button className="rounded bg-light secondary font-weight-bold my-1" onClick={() => { this.props.wishCallback(this.props.data.number + ": " + this.props.data.name + ";") }}
							style={{ display: (this.props.wishList === " is added to the waitlist") ? "block" : "none" }}>
							Remove from WishList
            </button>
					</Card.Body>
				</Card>

			</React.Fragment>
		)
	}
}

export default RecomCourse;