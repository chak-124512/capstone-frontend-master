import React, { Component } from "react";
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { Container, Row, Col } from "react-bootstrap";
import {Modal, Button, Collapse, CardBody, Card} from 'reactstrap';
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactTable from "react-table";
import "react-table/react-table.css";
import ls from "local-storage";
import { baseUrl } from "../../shared/baseUrl";

  class Workflow2 extends Component {

 constructor(props) {
    super(props);
    this.state = {
		columns: [],
		checker: [],
		colors: ['lightblue', 'orange', 'lightgreen', 'pink'],
		statsCols: ["Name"],
		statsData: [],
		name: "",
    modalShow: false,
    modalTopic: "",
    modalContent: ""
    };
 }

  componentDidMount() {
	// if user is logged in, show the buttons for retrieving and saving workflow
	const username = ls.get("username") || "";
	if (username != "") {
		document.getElementById("specialButtons").style.display = "";
		document.getElementById("name").style.display = "";
	}
	if (this.props.nodeDataArray.length>0) {
		document.getElementById("execute").style.display = "";
	}
  }

   // function thats gets called for help buttons
     getHelp = (topic) => {
    console.log("button clicked");
    console.log("selected topic", topic);
    const url = `${baseUrl}/get-help`;
    const statics_url = `${baseUrl}/static/`;
    const data = new FormData();
    data.append("topic", topic);
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        fetch(statics_url + data["description"])
          .then(res => {
            return res.text();
          })
          .then(html_data => {
            console.log("html data", html_data);
            this.setState({ modalContent: html_data });
          });
		  if (topic=="upload-structured-info") {
		  	  topic = "Uploading structured data";
		  }
        this.setState({ modalTopic: topic });
        this.setState({ modalShow: true });
      });
  };

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
        ))
      );
	  
	 // add diagram listener
	    diagram.addDiagramListener("ObjectSingleClicked",
      function(e) {
        var part = e.subject.part;
        if (!(part instanceof go.Link)) {
		    // expose the hidden div where a user can edit node settings
			var id = part.data.text;
			console.log(id);
			document.getElementById(id).style.display = "";
		}
      });

    return diagram;
  }

   // get statistics for displaying data node
	getstatistics() {
    const data = new FormData();
    data.append("fileKey", ls.get("token"));
	fetch(`${baseUrl}/stats`, {
      method: "POST",
      body: data
    })
	.then(response => response.json())
	.then(data => alert(data))
    
  }

     removeStopWords = () => {
    const data = new FormData();
    const fileKey = ls.get("token");
	if (fileKey == "") {
		alert("Please upload atleast 1 unstructured file!")
	} else {
		data.append("fileKey", fileKey);
		const required_columns = [];
		this.state.columns.forEach((column, index) => {
		  if (this.state.checker[index] == true) {
			required_columns.push(column);
		  }
		});
		data.append("columns", required_columns);
		console.log("stats columns", this.state.columns);
		console.log("our columns", required_columns);
		console.log("sending data", data);
		const url = `${baseUrl}/remove-stop-words`;
		fetch(url, {
		  method: "POST",
		  body: data
		})
		  .then(response => response.json())
		  .then(data => alert(data.message));
	}
  };

  // this method adds nodes on the workflow screen
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
		  const page = this.props.page;
		  nodeDataArray.push({key: currentNodeKey, text: nodeText, color: randomColor, loc: location});
		  if (nodeDataArray.length>1) {
			linkDataArray.push({key: currentLinkKey, from: currentNodeKey-1, to:currentNodeKey});
		  }
		  if (page=="workflow") {
			this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, currentNodeKey+1, currentLinkKey-1, y+150, "workflow2");
			this.props.changeDisplayToWorkflow2();
		  } else {
		  	this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, currentNodeKey+1, currentLinkKey-1, y+150, "workflow");
		  	this.props.changeDisplayToWorkflow();
		  }
		  
   }

   getWorkflow = () => {
	 const data = new FormData();
	 data.append("username", ls.get("username"));
	 data.append("type", "u"); // u for unstructured
	 fetch(`${baseUrl}/getWorkflow`, {
			  method: "POST",
			  body: data
			})
			  .then(response => response.json())
			  .then(data => {
			
				if (data.message=="no workflow") {
					alert("No workflow has been saved before with username: "+ls.get("username"));
				} else {
					var texts = data.texts;
					var colors = data.colors;
					var locs = data.locs;
					var i;
					var linkKey = -1
					const nodeDataArray = [];
					const linkDataArray = [];
					for (i=0; i<texts.length; i++) {
						nodeDataArray.push({key: i, text: texts[i], color: colors[i], loc: locs[i]});
						  if (nodeDataArray.length>1) {
							linkDataArray.push({key: linkKey, from: i-1, to:i});
							linkKey -= 1;
						  }
					}
					// keep track of whether current page is workflow 1 or workflow 2
					const currentNodeKey = this.props.nodeKey;
					const y = parseInt(locs[i-1].split(' ')[1]);
					  if (this.props.page=="workflow") {
						this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, i, linkKey-1, y+150, "workflow2");
						this.props.changeDisplayToWorkflow2();
					  } else {
					  	this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, i, linkKey-1, y+150, "workflow");
		  				this.props.changeDisplayToWorkflow();
					  }
				}


			  })
		  // .then(() => this.getFileButton.click())
		  .catch(err => console.log(err));
   }

   saveWorkflow = (nodeDataArray) => {
       const data = new FormData();
		if (nodeDataArray.length==0) {
			alert("Please create a workflow!");
		} else if (this.state.name=="") {
			alert("Please enter workflow name!")
		}
		else {
			data.append("username", ls.get("username"));
			data.append("type", "u"); // u for unstructured
			data.append("name", this.state.name);
			var i;
			var text;
			var color;
			var loc;
			for (i=0; i<nodeDataArray.length; i++) {
				text = "text" + i;
				color = "color" + i;
				loc = "loc" + i;
				data.append(text, nodeDataArray[i].text);
				data.append(color, nodeDataArray[i].color);
				data.append(loc, nodeDataArray[i].loc);
			}
			fetch(`${baseUrl}/saveWorkflow`, {
			  method: "POST",
			  body: data
			})
			  .then(response => response.json())
			  .then(data => {
			
				alert(data.message);


			  })
		  // .then(() => this.getFileButton.click())
		  .catch(err => console.log(err));
		}
   }

  render () {

    return (
	      <React.Fragment>
			<Container>
			<Row>
			<Col xs="5" sm="5"></Col>
			<Col xs="5" sm="5">
			<p></p>
			<p>
			<div id="specialButtons" style={{display:"none"}}>
			<Button onClick={() => this.getWorkflow()}>Retrieve saved workflow</Button>
			&nbsp;&nbsp;&nbsp;
			<Button onClick={() => this.saveWorkflow(this.props.nodeDataArray, this.props.linkDataArray)}>Save Workflow</Button>
			</div>
			</p>
			
			</Col>
			</Row>

			<Row>
			<Col xs="5" sm="5"></Col>
			<Col xs="5" sm="5">
			<p></p>
			<p>
			<div id="name" style={{display:"none"}}>
			Workflow name:
				<input
				  type="text"
				  value={this.state.name}
				  onChange={e => this.setState({ name: e.target.value })}
				/>
			</div>
			</p>
			</Col>
			</Row>

			<Row>
			<Col xs="5" sm="5"></Col>
			<Col xs="5" sm="5">
			<p></p>
			<p>
			<div id="execute" style={{display:"none"}}>
			<Button>Execute Workflow</Button>
			</div>
			</p>
			</Col>
			</Row>

				<Row>
				<Col xs="1" sm="1">
			<div class="box">
				Upload And Display
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Upload Files")}>Upload Files</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Display Data")}>Display Data</Button>
				<p></p>
			</div>

			<div class="box">
				Data Preprocessing
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Stemming")}>Stemming</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Lemmatization")}>Lemmatization</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Remove Selected Words")}>Remove Selected Words</Button>
				<p></p>
			</div>

			<div class="box">
				Visualizations
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Histogram")}>Histogram</Button>
				<p></p>
			</div>

			<div class="box">
				Data Modeling
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Topic Modeling")}>Topic Modeling</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Word Embedding")}>Word Embedding</Button>
				<p></p>
			</div>

			</Col>

				<Col xs="8" sm="8">
					<div
				  style={{
					align: "center",
					marginLeft: "20%",
					marginTop: "10px",
				  }}
				>
				<ReactDiagram
				  initDiagram={() => this.initDiagram(this.state)}
				  divClassName='diagram-component'
				  nodeDataArray={this.props.nodeDataArray}
          linkDataArray={this.props.linkDataArray}
				  onModelChange={() => this.handleModelChange}

        />
				</div>
			</Col>

			<Col xs="3" sm="3">
				<div style={{
            align: "center",
            marginLeft: "60%",
            marginTop: "10px",
			display: "none"}} id="Upload Files">
				 <h3>
              <u>Upload 1 or more Unstructured Files</u>
            </h3>
			
			<div class="box4">
				<p><b><i>File upload and upload options:</i></b></p>
				<p><font color="red"><b>File types supported - TXT, DOCX</b></font></p>
				<p>Adding only 1 file?
				&nbsp;&nbsp;&nbsp;
				<select
				  onChange={e => this.setState({ onlyOneFile: e.target.value })}
				>
				  <option>No</option>
				  <option>Yes</option>
				</select>
				</p>
				<p>
				<input
				  type="file"
				  ref={ref => {
					this.uploadInput = ref;
				  }}
				  multiple
				/>
				<Button onClick={() => this.getHelp("upload-unstructured-info")}>
					  Help!
				</Button>
				</p>
			</div>

			<div class="box4">
				<p><b><i>Data cleaning options:</i></b></p>
				<p>Perform word stemming?
				&nbsp;&nbsp;&nbsp;
				<select
				  onChange={e => this.setState({ stemming: e.target.value })}
				>
				  <option>No</option>
				  <option>Yes</option>
				</select>
				&nbsp;&nbsp;&nbsp;
				<Button onClick={() => this.getHelp("Stemming")}>
					  Help!
				</Button>
				</p>

				<p>Perform word lemmatization?
				&nbsp;&nbsp;&nbsp;
				<select
				  onChange={e => this.setState({ lemmatization: e.target.value })}
				>
				  <option>No</option>
				  <option>Yes</option>
				</select>
				&nbsp;&nbsp;&nbsp;
				<Button onClick={() => this.getHelp("Lemmatization")}>
					  Help!
				</Button>
				</p>
				</div>

			<div class="box4">
							<p><b><i>Data parsing options:</i></b></p>

				<p>Choose Data Parsing Type:
								&nbsp;&nbsp;&nbsp;

				<select
				  onChange={e => this.setState({ parsingType: e.target.value })}
				>
				  <option>tf-idf</option>
				  <option>LDA</option>
				</select>
				  &nbsp;&nbsp;&nbsp;
				<Button onClick={() => this.getHelp("Parsing")}>
					  Help!
				</Button>
				</p>
			</div>

          <br />
          <div>
            <Button
              type="button"
              onClick={() => this.uploadFile()}
            >Submit Files</Button>
          </div>
				</div>
			</Col>
			
			</Row>
	</Container>
</React.Fragment>
    );
  }
  }

  export default Workflow2;