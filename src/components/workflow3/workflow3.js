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

  class Workflow3 extends Component {

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

		}
      });
		  
	

    return diagram;
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
		  if (this.props.page=="workflow3") {
		  	this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, currentNodeKey+1, currentLinkKey-1, y+150, "workflow4");
			this.props.changeDisplayToWorkflow4();
		  } else {
		  	this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, currentNodeKey+1, currentLinkKey-1, y+150, "workflow3");
		  	this.props.changeDisplayToWorkflow3();
		  }
		  
   }

  getWorkflow = () => {
	 const data = new FormData();
	 data.append("username", ls.get("username"));
	 data.append("type", "s"); // s for structured
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
					  if (this.props.page=="workflow3") {
						this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, i, linkKey-1, y+150, "workflow4");
						this.props.changeDisplayToWorkflow4();
					  } else {
					  	this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, i, linkKey-1, y+150, "workflow3");
		  				this.props.changeDisplayToWorkflow3();
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
		} 
		else if (this.state.name=="") {
			alert("Please enter workflow name!")
		}
		else {
			data.append("username", ls.get("username"));
			data.append("type", "s"); // s for structured
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
				<Button onClick={() => this.addNodeToDiagram("Upload File")}>Upload File</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Display Data")}>Display Data</Button>
				<p></p>
			</div>

			<div class="box">
				Data Preprocessing
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Remove Missing Values")}>Remove Missing Values</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Remove Outside of Range")}>Remove Outside of Range</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Replace NAN by Specific Value")}>Replace NAN by Specific Value</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Replace Specific Value")}>Replace Specific Value</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Replace Missing Values by Mean")}>Replace Missing Values by Mean</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Replace Missing Values by Median")}>Replace Missing Values by Median</Button>
				<p></p>
			</div>

			<div class="box">
				Visualizations
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Histogram")}>Histogram</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Correlation")}>Correlation</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Box Plot")}>Box Plot</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Applied PCA")}>Applied PCA</Button>
				<p></p>
			</div>

			<div class="box">
				Transformation
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Standard Scaling")}>Standard Scaling</Button>
				<p></p>
				<Button onClick={() => this.addNodeToDiagram("Min-Max Scaling")}>Min-Max Scaling</Button>
				<p></p>
			</div>

			<div class="box">
				Data Modeling
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
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Upload File">
				 <h3>
              <u>Upload a Structured File</u>
            </h3>

			<div class="box4">
				<p><b><i>File upload and upload options:</i></b></p>
				<p><font color="red"><b>File types supported - CSV, stuctured TXT with a delimiter</b></font></p>
				<p>
				<input
				  type="file"
				  ref={ref => {
					this.uploadInput = ref;
				  }}
				/>
				<Button onClick={() => this.getHelp("upload-structured-info")}>
					  Help!
				</Button>
				</p>
				<p>
				Delimiter(Optional):
				<input
				  type="text"
				  value={this.state.delimiter}
				  size="2"
				  onChange={e => this.setState({ delimiter: e.target.value })}
				/>
			  </p>
			  </div>				

          <br />
				</div>

					<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Remove Missing Values">
			</div>

				<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Remove Outside of Range">
			         <div class="box4">
            <h3>
              <u>Remove Outside of Range</u>
            </h3>
            <table>
              <tr>
                <td style={{ width: 200 }}>
                  <input
                    type="text"
                    placeholder={this.state.removeRangeMinValue}
                    style={{ width: "90px" }}
                    onChange={e =>
                      this.setState({ removeRangeMinValue: e.target.value })
                    }
                  />{" "}
                  &nbsp;&nbsp;&nbsp;
                  <input
                    type="text"
                    placeholder={this.state.removeRangeMaxValue}
                    style={{ width: "90px" }}
                    onChange={e =>
                      this.setState({ removeRangeMaxValue: e.target.value })
                    }
                  />
                </td>
                <input
                  type="button"
                  value="Help!"
                  onClick={() => this.getData("remove-range")}
                />
              </tr>
              </table>
          </div>
			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Replace NAN by Specific Value">
			         <div class="box4">
            <h3>
              <u>Replace NAN by Specific Value</u>
            </h3>
            <table>
              <tr>
                <td style={{ width: 200 }}>
                  <input
                    type="text"
                    placeholder={this.state.replaceSpecificValue}
                    style={{ width: "90px" }}
                    onChange={e =>
                      this.setState({ replaceSpecificValue: e.target.value })
                    }
                  />{" "}
                </td>
                <input
                  type="button"
                  value="Help!"
                  onClick={() => this.getData("replace-nan")}
                />
              </tr>
            </table>
          </div>
			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Replace Specific Value">
			         <div class="box4">
            <h3>
              <u>Replace Specific Value</u>
            </h3>
            <table>
              <tr>
                <td style={{ width: 200 }}>
                  <input
                    type="text"
                    placeholder="Old Value"
                    style={{ width: "90px" }}
                    onChange={e =>
                      this.setState({ replaceOldValue: e.target.value })
                    }
                  />{" "}
                  &nbsp;&nbsp;&nbsp;
                  <input
                    type="text"
                    placeholder="New Value"
                    style={{ width: "90px" }}
                    onChange={e =>
                      this.setState({ replaceNewValue: e.target.value })
                    }
                  />{" "}
                </td>
                <Button onClick={() => this.getData("remove-range")}>
                  Help!
                </Button>
              </tr>
            </table>
          </div>
			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Replace Missing Values by Mean">            
			</div>

				<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Replace Missing Values by Median">
			</div>

			</Col>
			
			</Row>
	</Container>
</React.Fragment>
    );
  }
  }

  export default Workflow3;