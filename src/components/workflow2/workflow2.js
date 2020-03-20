import React, { Component } from "react";
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

  class Workflow2 extends Component {

 constructor(props) {
    super(props);
    this.state = {
	  colors: ['lightblue', 'orange', 'lightgreen', 'pink'],
	  modalShow: false,
      modalTopic: "Upload Unstructured Files",
      modalContent: "Upload 1 or more unstructured files"
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
				click: this.setState({ modalShow: true })},$(go.TextBlock, "click")))
      );

	  /*if (this.props.nodeDataArray.length>0) {
	   diagram.model.addNodeData(this.props.nodeDataArray);
	   console.log("insertion success");
	  }*/
		  
	

    return diagram;
  }



  /*
   * This function is used to call a modal window
   */
   call() {
	 this.setState({ modalShow: true });
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
			this.props.changeDisplayToWorkflow2();
		  } else {
		  	this.props.changeDisplayToWorkflow();
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
			<Button onClick={() => this.addNodeToDiagram("Upload Unstructured Files")}>Upload Unstructured Files</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Remove Stop Words")}>Remove Stop Words</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Topic Modeling")}>Topic Modeling</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Word Embedding")}>Word Embedding</Button>

			</Col>
			</Row>
	</Container>
	 <Modal
          show={this.state.modalShow}
          onHide={e => this.setState({ modalShow: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalTopic}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.modalContent}
              disabled={true}
              config={{ toolbar: [] }}
            />
			<input
              style={{ marginLeft: "20px", marginBottom: "20px" }}
              type="file"
              ref={ref => {
                this.uploadInput = ref;
              }}
			  multiple
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={e => this.setState({ modalShow: false })}
            >
              Close
            </Button>
            <Button variant="primary">Save Changes</Button>
          </Modal.Footer>
        </Modal>
</React.Fragment>
    );
  }
  }

  export default Workflow2;