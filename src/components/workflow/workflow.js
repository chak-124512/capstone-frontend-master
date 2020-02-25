import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Board from './board';
import Card from './card';

class Workflow extends Component {
submitWorkflow = () => {
   
  };
	render () {
		return(<React.Fragment>
			<main className="flexbox">
					<Board id="board1" className="board1">
						
					</Board>
					<Board id="board2" className="board2">
					<Card id="card1" className="card" draggable="true">
							<p>Upload File</p>
						</Card>
						<Card id="card2" className="card" draggable="true">
							<p>Preprocess Data</p>
						</Card>
						<Card id="card3" className="card" draggable="true">
							<p>Data Visualization</p>
						</Card>
						<Card id="card4" className="card" draggable="true">
							<p>Data Transformation</p>
						</Card>
						<Card id="card5" className="card" draggable="true">
							<p>Data Mining</p>
						</Card>
					</Board>
			</main>
		 <br />
</React.Fragment>);
	}
}

export default Workflow;