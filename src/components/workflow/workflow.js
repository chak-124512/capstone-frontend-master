import React, { Component } from "react";
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

  class Workflow extends Component {

 constructor(props) {
    super(props);
    this.state = {
		columns: [],
    checker: [],
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
				click: this.call},$(go.TextBlock, "click")))
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
   call(text) {
        document.getElementById("Upload Unstructured Files").style.display = "";
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
  const { columns: cols } = this.state;
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
						<b>File Upload Node:</b>
						<p></p>
			<Button onClick={() => this.addNodeToDiagram("Upload Unstructured Files")}>Upload Unstructured Files</Button>
			<p></p>
			<b>Display Data Node:</b>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Display Data")}>Display Data</Button>
			<p></p>
						<b>Pre-processing Nodes:</b>
						<p></p>
			<Button onClick={() => this.addNodeToDiagram("Perform stemming")}>Perform stemming</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Perform lemmatization")}>Perform lemmatization</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Remove Selected Words")}>Remove Stop Words</Button>
			<p></p>
						<b>Data Mining Nodes:</b>
						<p></p>
			<Button onClick={() => this.addNodeToDiagram("Topic Modeling")}>Topic Modeling</Button>
			<p></p>
			<Button onClick={() => this.addNodeToDiagram("Word Embedding")}>Word Embedding</Button>

			</Col>
			</Row>
	</Container>
	
		<div id="Upload Unstructured Files" 
		style={{align: "center",
            marginLeft: "20%",
            marginTop: "10px",display: "none"}}>
			<div style={{}}>
            <h3>
              <u>Upload 1 or more Unstructured Files</u>
            </h3>
			<p><i>File types supported - TXT, DOCX</i></p>
			<Button onClick={() => this.getData("upload-unstructured-info")}>
                  What happens when I upload?
            </Button>
            <input
              style={{ marginLeft: "20px", marginBottom: "20px" }}
              type="file"
              ref={ref => {
                this.uploadInput = ref;
              }}
			  multiple
            />

			<p>Perform word stemming?
			&nbsp;&nbsp;&nbsp;
            <select
              onChange={e => this.setState({ stemming: e.target.value })}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
			&nbsp;&nbsp;&nbsp;
			<Button onClick={() => this.getData("stemming-info")}>
                  Help!
            </Button>
			</p>

			<p>Perform word lemmatization?
			&nbsp;&nbsp;&nbsp;
            <select
              onChange={e => this.setState({ lemmatization: e.target.value })}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
			&nbsp;&nbsp;&nbsp;
			<Button onClick={() => this.getData("lemmatization-info")}>
                  Help!
            </Button>
			</p>

		  </div>

		  <br />
          <div>
			<p>Enter Description(Optional):</p>
            <textarea
              value={this.state.description}
              cols="30"
              rows="5"
              resize="false"
              onChange={e => this.setState({ description: e.target.value })}
            ></textarea>
			</div>
            
          <br />
          <div>
            <Button
              type="button"
              onClick={() => this.uploadFile()}
            >Submit Files</Button>
          </div>
		  </div>
		
		  <div id="Remove Selected Words" style={{ marginLeft: 245, marginTop: 10, display: "none"}}>
          <div>
            <span
              style={{
                position: "relative",
                left: "30%",
                top: "10px"
              }}
            >
            </span>
          </div>
          <br />
          <br />

          <div>
            <h3>
              <u>Cleaning Process</u>
            </h3>
			<br />
          <div>
            <Button
              type="button"
              onClick={() => this.removeStopWords()}
            >Remove Selected Words from the table</Button>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<input
                  type="button"
                  value="Help!"
                  onClick={() => this.getData("remove-words")}
                />
			
          </div>
		  	
			<br />

			<Row style={{ paddingLeft: 10, paddingTop: 10 }}>
          {cols.map((item, key) => (
            <Col key={key} md="3">
              <Row>
                <Col>
                  <label>{item}</label>
                </Col>
                <Col>
                  <input
                    type="checkbox"
                    value={item}
                    onChange={e => {
                      this.updateCheck(e, key);
                    }}
                  />
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
			<br />
            
          </div>
		  </div>

          


</React.Fragment>
    );
  }
  }

  export default Workflow;