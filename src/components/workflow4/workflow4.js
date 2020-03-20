import React, { Component } from "react";
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

  class Workflow4 extends Component {

 constructor(props) {
    super(props);
    this.state = {
	  colors: ['lightblue', 'orange', 'lightgreen', 'pink']
    };
 }
  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model and any templates.
   * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
   */
  initDiagram() {
  console.log("init called");
    const $ = go.GraphObject.make;
    const diagram =
      $(go.Diagram,
        {
          'undoManager.isEnabled': true,  // must be set to allow for model change listening
          // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
          'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
          model: $(go.GraphLinksModel,
            {
              linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
            })
        });

    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, 'Auto',  // the Shape will go around the TextBlock
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          { name: 'SHAPE', fill: 'white', strokeWidth: 0 },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
		  $(go.Panel, "Vertical", { margin: 3 },
        $(go.TextBlock,
          { margin: 8, editable: true },  // some room around the text
          new go.Binding('text').makeTwoWay()
        ),
		$("Button",
			  { margin: 8,
				click: this.call },$(go.TextBlock, "click")))
      );

	  /*if (this.props.nodeDataArray.length>0) {
	   diagram.model.addNodeData(this.props.nodeDataArray);
	   console.log("insertion success");
	  }*/
		  
	

    return diagram;
  }



  /*
   * This function is used to call an alert
   */
   call() {
	alert('Button clicked');
   }

     /**
   * This function handles any changes to the GoJS model.
   * It is here that you would make any updates to your React state, which is dicussed below.
   */
  handleModelChange(changes) {
    console.log('GoJS model changed!');
  }

   addNodeToDiagram(nodeText) {
		// create the model data that will be represented by Nodes and Links
		  const currentNodeKey = this.props.nodeKey;
		  const currentLinkKey = this.props.linkKey;

		  const colors = this.state.colors;
		  const randomColor = colors[Math.floor(Math.random() * colors.length)];
		  const y = this.props.y;
		  const location = '0 ' + y.toString();
		  const nodeDataArray = this.props.nodeDataArray;
		  const linkDataArray = this.props.linkDataArray;
		  nodeDataArray.push({key: currentNodeKey, text: nodeText, color: randomColor, loc: location});
		  if (nodeDataArray.length>1) {
			linkDataArray.push({key: currentLinkKey, from: currentNodeKey-1, to:currentNodeKey});
		  }
		  this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, currentNodeKey+1, currentLinkKey-1, y+150);
		  if (currentNodeKey%2==0) {
			this.props.changeDisplayToWorkflow4();
		  } else {
		  	this.props.changeDisplayToWorkflow3();
		  }
		  
   }

  render () {
    return (
	      <React.Fragment>
			<Container>
				<Row>
				<Col xs="11" sm="11">
					<div
				  style={{
					align: "center",
					marginLeft: "20%",
					marginTop: "10px",
				  }}
				>
				<ReactDiagram
				  initDiagram={() => this.initDiagram()}
				  divClassName='diagram-component'
				   nodeDataArray={this.props.nodeDataArray}
          linkDataArray={this.props.linkDataArray}
				  onModelChange={() => this.handleModelChange}

        />
				</div>
			</Col>
			<Col xs="1" sm="1">
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Upload Structured File")}>Upload Structured File</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Remove Missing Values")}>Remove Missing Values</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Remove Outside of Range")}>Remove Outside of Range</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Replace NAN By Specific Value")}>Replace NAN By Specific Value</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Replace Specific Value")}>Replace Specific Value</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Replace Missing Values by Mean")}>Replace Missing Values by Mean</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Replace Missing Values by Median")}>Replace Missing Values by Median</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Generate Histogram")}>Generate Histogram</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Generate Correlation Matrix")}>Generate Correlation Matrix</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Generate Box Plot")}>Generate Box Plot</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Standard Scaling")}>Standard Scaling</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Min-Max Scaling")}>Min-Max Scaling</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Linear Regression")}>Linear Regression</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Random Forest")}>Random Forest</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Support Vector Machine")}>Support Vector Machine</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("K-Nearest Neighbor")}>K-Nearest Neighbor</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Multilayer Perceptron")}>Multilayer Perceptron</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Hierarchial Clustering")}>Hierarchial Clustering</Button>
			</Col>
			</Row>
	</Container>
</React.Fragment>
    );
  }
  }

  export default Workflow4;