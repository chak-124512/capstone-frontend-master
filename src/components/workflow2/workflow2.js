import React, { Component } from "react";
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ReactTable from "react-table";
import "react-table/react-table.css";
import ls from "local-storage";
import { baseUrl } from "../../shared/baseUrl";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { JsonToTable } from "react-json-to-table";
import renderIf from "render-if";

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
		description: "",
		isStructured: "No",
		onlyOneFile: "No",
		stemming: "No",
		lemmatization: "No",
		parsingType: "TF-IDF",
		topics: "",
		modalShow: false,
		modalTopic: "",
		modalContent: "",
		workflow_name: this.props.name,
		images: [],
		n_topics: 0,
		selectAllCols: "No"
    };
 }

   // function that gets called automatically when page is loaded
  componentDidMount() {
	if (this.props.nodeDataArray.length>0) {
		document.getElementById("save").style.display = "";
		document.getElementById("clear").style.display = "";
	}
	const data = new FormData();
		 data.append("username", ls.get("username"));
		 data.append("type", "u"); // u for unstructured
		fetch(`${baseUrl}/getUsersWorkflows`, {
				  method: "POST",
				  body: data
				})
				  .then(response => response.json())
				  .then(data => {
					this.state.user_workflow_names = data.result;
					document.getElementById("saved_workflows").innerHTML = this.state.user_workflow_names
				  })
			  // .then(() => this.getFileButton.click())
			  .catch(err => console.log(err));

		this.getColumns();
  }


  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model and any templates.
   * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
   */
  initDiagram(props) {
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
			// hide other divs
			var i = 0;
			for (i=0;i<props.nodeDataArray.length;i++) {
				document.getElementById(props.nodeDataArray[i].text).style.display = "none";
			}
		    // expose the hidden div where a user can edit node settings
			console.log(part.data.text);
			document.getElementById(part.data.text).style.display = "";
			if (part.data.text=="Display Data") {
				document.getElementById("key").innerHTML = part.data.key;
			}
			if (part.data.text=="Remove Selected Words" || part.data.text=="Topic Modeling" || part.data.text=="Word Embedding") {
				document.getElementById("allCols").style.display = "";
			}
		}
      });
		  
	

    return diagram;
  }

	// function to add node to a workflow 
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
		  this.changeWorkflowScreen(nodeDataArray, linkDataArray, currentNodeKey+1, currentLinkKey-1, y+150);
   }

   // function that gets called to retrieve a saved workflow
  getWorkflow = () => {
	 const data = new FormData();
	 if (this.state.workflow_name=="") {
	 	 alert("Please enter saved workflow name!");
	 } else {
		 data.append("username", ls.get("username"));
		 data.append("type", "u"); // u for unstructured
		 data.append("workflow_name", this.state.workflow_name.toLowerCase());
		 fetch(`${baseUrl}/getWorkflow`, {
				  method: "POST",
				  body: data
				})
				  .then(response => response.json())
				  .then(data => {
			
					if (data.message=="no workflow") {
						alert("No workflow: "+ this.state.workflow_name + " has been saved before with username: "+ls.get("username"));
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
						this.changeWorkflowScreen(nodeDataArray, linkDataArray, i, linkKey-1, y+150);
					}


				  })
			  // .then(() => this.getFileButton.click())
			  .catch(err => console.log(err));
		  }
   }

   // function to save a workflow
   saveWorkflow = (nodeDataArray) => {
       const data = new FormData();
		if (nodeDataArray.length==0) {
			alert("Please create a workflow!");
		} 
		else if (this.state.workflow_name=="") {
			alert("Please enter workflow name!")
		}
		else {
			data.append("username", ls.get("username"));
			data.append("type", "u"); // u for unstructured
			data.append("workflow_name", this.state.workflow_name.toLowerCase());
			const filename = ls.get("u_workflow_token") || "";
			data.append("filename", filename);
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
				if (!this.state.user_workflow_names.includes(this.state.workflow_name)) {
					this.state.user_workflow_names.push(this.state.workflow_name);
				}
				document.getElementById("saved_workflows").innerHTML = this.state.user_workflow_names;

			  })
		  // .then(() => this.getFileButton.click())
		  .catch(err => console.log(err));
		}
   }

   // function to delete all nodes of the workflow
   clearWorkflow = () => {
		const nodeDataArray = [];
		const linkDataArray = [];
		this.changeWorkflowScreen(nodeDataArray, linkDataArray, 0, 0, 0);
   }

   // function that gets called to delete a saved workflow
  deleteWorkflow = () => {
	 const data = new FormData();
	 if (this.state.workflow_name=="") {
	 	 alert("Please enter a workflow name!");
	 } else if (!this.state.user_workflow_names.includes(this.state.workflow_name)) {
	 	 alert("Please enter a workflow name that i saved!");
	 } else {
		 data.append("username", ls.get("username"));
		 data.append("type", "u"); // u for unstructured
		 data.append("workflow_name", this.state.workflow_name);
		 fetch(`${baseUrl}/deleteWorkflow`, {
				  method: "POST",
				  body: data
				})
				  .then(response => response.json())
				  .then(data => {
					alert(data.message);
					const index = this.state.user_workflow_names.indexOf(this.state.workflow_name);
					this.state.user_workflow_names.splice(index, 1);
					document.getElementById("saved_workflows").innerHTML = this.state.user_workflow_names;
					this.clearWorkflow();
				  })
			  // .then(() => this.getFileButton.click())
			  .catch(err => console.log(err));
		  }
   }


   // function to change to duplicate page - to reflect changes in node addition
   changeWorkflowScreen = (nodeDataArray, linkDataArray, nodeKey, linkKey, y) => {
		if (this.props.page=="workflow") {
			this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, nodeKey, linkKey, y, this.state.workflow_name, "workflow2");
			this.props.changeDisplayToWorkflow2();
		} else {
			this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, nodeKey, linkKey, y, this.state.workflow_name,  "workflow");
		  	this.props.changeDisplayToWorkflow();
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

  uploadFile = () => {
    const { description, isStructured, onlyOneFile, stemming, lemmatization, parsingType, topics } = this.state;
    const files = this.uploadInput.files;
    const data = new FormData();
	if (files.length == 0)  {
		alert("Please upload atleast 1 file.")
	}
	else if (parsingType=="LDA" && (topics == "" || isNaN(topics))) {
		alert("Enter a valid topic number.")
	}
	else {
			for (var i=0; i<files.length; i++) {
				var key = "file"+i;
				data.append(key, files[i]);
			}

		data.append("isStructured", isStructured);
		data.append("description", description);
		data.append("onlyOneFile", onlyOneFile);
		data.append("stemming", stemming);
		data.append("lemmatization", lemmatization);
		data.append("parsingType", parsingType);
		data.append("topics", topics);

		// this.props.getData(uploadTest);
		// this.props.changeDisplay();
		console.log(files);
		fetch(`${baseUrl}/upload`, {
		  method: "POST",
		  body: data
		})
		  .then(response => response.json())
		  .then(data => {
			
			alert(data.message);

			const { filename: token } = data;
			// alert(JSON.stringify(data));
			this.setState({ token });
			ls.set("u_workflow_token", token);

		  })
		  // .then(() => this.getFileButton.click())
		  .catch(err => console.log(err));
	  }
  };

  changeParsingType = (e) => {
		this.setState({ parsingType: e.target.value });
		if (e.target.value == "LDA") {
			document.getElementById("topic").style.display = "";
		} else {
			document.getElementById("topic").style.display = "none";
		}
  }
  

    // all functions for Preprocessing structured data
    async getColumns() {
    const data = new FormData();
    const fileKey = ls.get("u_workflow_token") || "";
    console.log(fileKey);
    data.append("fileKey", fileKey);
    const url = `${baseUrl}/stats`;
    const response = await fetch(url, {
      method: "POST",
      body: data
    });
    const columns = await response.json();
    var result = columns.columns;
	result = result.slice(1,result.length);
	this.setState({ columns: result });
  }

  // function for displaying data
  displayData = () => {
  	 const workflow_name = this.state.workflow_name;
	 const filename = ls.get("u_workflow_token") || "";
	if (workflow_name=="") {
		alert("Please enter a workflow name before displaying data");
	} else if (filename == "") {
		alert("No file has been uploaded!")
	} else {
		const data = new FormData();
		data.append("username", ls.get("username"));
		data.append("workflow_name", workflow_name);
		data.append("filename", filename);
		data.append("key", document.getElementById("key").innerText);
		const data_url = `${baseUrl}/static/data-file/`;
		fetch(`${baseUrl}/displayDataWorkflow`, {
			  method: "POST",
			  body: data
			})
			  .then(response => response.json())
			  .then(data => {
				if (data["description"]=="No file uploaded") {
					alert(data["description"] + " with username: " + ls.get("username") + " and workflow name: "+workflow_name);
				} else {
					console.log(data_url+ data["description"]);
					window.open(data_url+ data["description"]);
				}
      });
	}
  }

  removeStopWords = () => {
    const data = new FormData();
    const fileKey = ls.get("u_workflow_token");
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
		  .then(data => {
		  alert(data.message);
		  this.getColumns();});
	}
  };

    updateCheck = (e, index) => {
    console.log("e", index);
    const { checker } = this.state;
    checker[index] = !checker[index];
    this.setState({ checker: checker });
    console.log("checker", this.state.checker);
  };

  submitData(selectedModel) {
    console.log("Data Submit");
    console.log("selected model", selectedModel);
    const fileKey = ls.get("u_workflow_token");
    const images = [];
	const statics_url = `${baseUrl}/static/`;
	const required_columns = [];
    this.state.columns.forEach((column, index) => {
      if (this.state.checker[index] == true) {
        required_columns.push(column);
      }
    });
	const selectAllCols = this.state.selectAllCols;

    if (selectedModel == "TM") {
		const data = new FormData();
      data.append("fileKey", fileKey);
      data.append("n_topics", this.state.n_topics);
	  data.append("selectAllCols", selectAllCols);
	  data.append("columns", required_columns);
      const url = `${baseUrl}/topic-modeling`;
      fetch(url, {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(data => {
			if (data["description"]=="No file has been uploaded. Please upload atleast 1 file in the upload file tab.") {
				alert(data["description"])
			} else {
				window.open(statics_url+ data["description"]);
			}
        
      });
	} else if (selectedModel == "WE") {
		const data = new FormData();
      data.append("fileKey", fileKey);
	   data.append("selectAllCols", selectAllCols);
	  data.append("columns", required_columns);
      const url = `${baseUrl}/word-embedding`;
      fetch(url, {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(data => {
			console.log("getting data", data);
			if (data.saved_file) images.push(data.saved_file);
        
      })
	  .then(() => {
          this.setState({ images });
        })
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
			List of saved workflows with this username: &nbsp;
			<b id="saved_workflows"></b>
			</p>
			</Col>
			</Row>
			
			<Row>
			<Col xs="5" sm="5"></Col>
			<Col xs="5" sm="5">
			<p> Enter existing workflow name (if wanting to retrieve or overwrite) or new workflow name (if creating new):</p>
			<p>
			<font color="red">*</font>
				<input
				  type="text"
				  value={this.state.workflow_name}
				  onChange={e => this.setState({ workflow_name: e.target.value })}
				/>
			</p>
			
			</Col>
			</Row>

			<Row>
			<Col xs="5" sm="5"></Col>
			<Col xs="5" sm="5">
			<p></p>
			<p>
			<div>
			<Button onClick={() => this.getWorkflow()}>Retrieve saved workflow</Button>
			</div>
			</p>
			</Col>
			</Row>

			<Row>
			<Col xs="5" sm="5"></Col>
			<Col xs="5" sm="5">
			<p></p>
			<p>
			<Button onClick={() => this.deleteWorkflow()}>Delete Workflow</Button>
			</p>
			</Col>
			</Row>

			<Row>
			<Col xs="5" sm="5"></Col>
			<Col xs="5" sm="5">
			<p></p>
			<p>
			<div id="save" style={{display:"none"}}>
			<Button onClick={() => this.saveWorkflow(this.props.nodeDataArray, this.props.linkDataArray)}>Save or overwrite Workflow</Button>
			</div>
			</p>
			</Col>
			</Row>

			<Row>
			<Col xs="5" sm="5"></Col>
			<Col xs="5" sm="5">
			<p></p>
			<p>
			<div id="clear" style={{display:"none"}}>
			<Button onClick={() => this.clearWorkflow()}>Clear Workflow</Button>
			</div>
			</p>
			</Col>
			</Row>

			<Row>
			{this.state.images.map((url, index) => (
            <Col md="6" style={{ paddingLeft: 30, paddingTop: 20 }}>
              <div key={index}>
                <img
                  style={{ width: 550, height: 550 }}
                  src={`${baseUrl}/static/` + url}
                />{" "}
                <br />
                <br />
              </div>
            </Col>
          ))}
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
				<Button onClick={() => this.addNodeToDiagram("Remove Selected Words")}>Remove Selected Words</Button>
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
				  initDiagram={() => this.initDiagram(this.props)}
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
				  onChange={e => this.changeParsingType(e)}
				>
				  <option>TF-IDF</option>
				  <option>LDA</option>
				</select>
				  &nbsp;&nbsp;&nbsp;
				<Button onClick={() => this.getHelp("Parsing")}>
					  Help!
				</Button>
				</p>
				<p>
				<div id="topic" style={{display: "none"}}>Enter number of topics:
				<input
					type="text"
					value={this.state.topics}
					onChange={e => this.setState({ topics: e.target.value })}
				  />
				</div>	
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

		  <div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Display Data">
			<Button onClick={() => this.displayData()}>
					  Click here to display data
				</Button>
				<div style={{display: "none"}} id="key"></div>
			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Remove Selected Words">
			<Button
              type="button"
              onClick={() => this.removeStopWords()}
            >Remove Selected Words from the table</Button>
			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Topic Modeling">
				<Row>
					<Col>Select All Columns:&nbsp;&nbsp;&nbsp;
					<select
					  onChange={e => this.setState({ selectAllCols: e.target.value })}
					>
					<option>No</option>
					  <option>Yes</option>
              
					</select>
					</Col>
					</Row>
					<Row>&nbsp;&nbsp;&nbsp;</Row>
					<Row>
					Enter the number of topics you want to get:
					</Row>
					<Row>
					  <input
						type="text"
						onChange={e => this.setState({ n_topics: e.target.value })}
					  />
				</Row>
									<Row>&nbsp;&nbsp;&nbsp;</Row>

			<Row>
              <input
                type="button"
                value="Perform Topic Modelling"
                onClick={() => this.submitData('TM')}
              />
            </Row>

			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Word Embedding">
				<Row>
					<Col>Select All Columns:&nbsp;&nbsp;&nbsp;
					<select
					  onChange={e => this.setState({ selectAllCols: e.target.value })}
					>
					<option>No</option>
					  <option>Yes</option>
              
					</select>
					</Col>
					</Row>
										<Row>&nbsp;&nbsp;&nbsp;</Row>

					<Row>
              <input
                type="button"
                value="Perform word Embedding"
                onClick={() => this.submitData('WE')}
              />
            </Row>
			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="allCols">
			<div class="column-box2">
				<h5>Select columns</h5>
				<Row style={{ paddingLeft: 10, paddingTop: 10 }}>
				  {this.state.columns.map((item, key) => (
					<Col key={key} md="8">
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
			</div>
		</div>


			</Col>
			
			</Row>

			

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
            {/* {renderHTML(this.state.modalContent)} */}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={e => this.setState({ modalShow: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>


	</Container>
</React.Fragment>
    );
  }
  }

  export default Workflow2;