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


  class Workflow3 extends Component {

 constructor(props) {
    super(props);
    this.state = {
		user_workflow_names : [],
		columns: [],
		checker: [],
		colors: ['lightblue', 'orange', 'lightgreen', 'pink'],
		statsCols: ["Name"],
		statsData: [],
		workflow_name: this.props.name,
		images: [],
		displayCorrelation: false,
		correlationRows: [],
		correlationCols: [],
		modalShow: false,
		modalTopic: "",
		modalContent: "",
		vizModalShow: false,
		vizModalTopic: "",
		delimiter: "",
		 evalutionModel: [],
		  evalutionModelValue: "",
		   n_estimator: 100,
		  max_depth: 2,
		  n_clusters: 2,
		  n_topics: 0
    };
	    this.selectEvalutionModel = this.selectEvalutionModel.bind(this);

 }

  // function that gets called automatically when page is loaded
  componentDidMount() {
	if (this.props.nodeDataArray.length>0) {
		document.getElementById("save").style.display = "";
		document.getElementById("clear").style.display = "";
	}
	const data = new FormData();
		 data.append("username", ls.get("username"));
		 data.append("type", "s"); // s for structured
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

		 this.setState({
      evalutionModel: [
        { id: "", name: "Select Evaluation Model" },
        { id: "TTS", name: "Train-test split" },
        { id: "CV", name: "Cross Validation" },
        { id: "NO", name: "None(for clustring)" }
      ]});

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
			const vizList = ['Histogram', 'Correlation', 'Box Plot', 'Applied PCA', 'Standard Scaling', 'Min-Max Scaling'];
			const modList = ['Linear Regression', 'Random Forest', 'Support Vector Machine', 'K-Nearest Neighbor', 'Multilayer Perceptron', 'Hierarchial Clustering']
			if (vizList.includes(part.data.text)) {
				document.getElementById("allCols").style.display = "";
			} else if (modList.includes(part.data.text)) {
				document.getElementById("allCols").style.display = "";
				document.getElementById("Evaluation model").style.display = "";
			} else {
				document.getElementById("allCols").style.display = "none";
				document.getElementById("Evaluation model").style.display = "none";
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
		 data.append("type", "s"); // s for structured
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
			data.append("type", "s"); // s for structured
			data.append("workflow_name", this.state.workflow_name.toLowerCase());
			const filename = ls.get("workflow_token") || "";
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
		 data.append("type", "s"); // s for structured
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
		if (this.props.page=="workflow3") {
			this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, nodeKey, linkKey, y, this.state.workflow_name, "workflow4");
			this.props.changeDisplayToWorkflow4();
		} else {
			this.props.onWorkflowDataChange(nodeDataArray, linkDataArray, nodeKey, linkKey, y, this.state.workflow_name,  "workflow3");
		  	this.props.changeDisplayToWorkflow3();
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

  // function for uploading file
  uploadFile = () => {
	const workflow_name = this.state.workflow_name;
	if (workflow_name=="") {
		alert("Please enter a workflow name before uploading a file");
	} else {
		const { delimiter, description } = this.state;
		const files = this.uploadInput.files;
		const data = new FormData();
		if (files.length == 0)  {
			alert("Please upload a file.")
		} else {
			const file = files[0];
			data.append("file", file);
			data.append("delimiter", delimiter);
			data.append("isStructured", "Yes");
			data.append("workflow", "Yes");
			data.append("username", ls.get("username"));
			data.append("workflow_name", workflow_name);
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
				ls.set("workflow_token", token);
			  })
			  .catch(err => console.log(err));
		  }
	  }
  };

  // function for displaying data
  displayData = () => {
  	 const workflow_name = this.state.workflow_name;
	 const filename = ls.get("workflow_token") || "";
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

  // all functions for Preprocessing structured data
    async getColumns() {
    const data = new FormData();
    const fileKey = ls.get("workflow_token") || "";
    console.log(fileKey);
    data.append("fileKey", fileKey);
    const url = `${baseUrl}/stats`;
    const response = await fetch(url, {
      method: "POST",
      body: data
    });
    const columns = await response.json();
    this.setState({ columns: columns.columns });
  }

  async statsByColumns(e) {
    const col = e.target.value;
    this.setState({ selectedColumn: col });
    const data = new FormData();
    data.append("column", col);
    data.append("fileKey", ls.get("workflow_token"));
    const url = `${baseUrl}/stats-by-column`;
    const response = await fetch(url, {
      method: "POST",
      body: data
    });
    const x = await response.json();
    const keys = Object.keys(x);
    let table = [];
    keys.forEach(key => {
      if (key == "Visualization") {
        const list = x["Visualization"].map(path => {
          const link = `${baseUrl}` + path;
          return (
            <span>
              <a href={link}>Click here</a> &nbsp;
            </span>
          );
        });
        table.push({
          key: key,
          value: list
        });
      } else {
        table.push({
          key: key,
          value: x[key]
        });
      }
    });
    this.setState({ table });
  }

  sendRemoveMissing = () => {
    const { removeMissing } = this.state;
    const url = `${baseUrl}/remove-missing`;
    const data = new FormData();
    const fileKey = ls.get("workflow_token") || "";
    data.append("fileKey", ls.get("workflow_token"));
    data.append("flag", removeMissing);
    data.append("column", this.state.selectedColumn);
    fetch(url, {
      method: "post",
      body: data
    })
      .then(response => response.json())
      .then(data => alert(data.message))
      .catch(err => alert(err));
  };

  sendRemoveRange = () => {
    const { removeRangeMinValue, removeRangeMaxValue } = this.state;
    const data = new FormData();
    const fileKey = ls.get("workflow_token") || "";
    data.append("min", removeRangeMinValue);
    data.append("max", removeRangeMaxValue);
    data.append("column", this.state.selectedColumn);
    data.append("fileKey", fileKey);
    const url = `${baseUrl}/remove-range`;
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => alert(data.message));
  };

  sendSpecificValue = () => {
    const { replaceSpecificValue } = this.state;
    const data = new FormData();
    const fileKey = ls.get("workflow_token") || "";
    data.append("value", replaceSpecificValue);
    data.append("column", this.state.selectedColumn);
    data.append("fileKey", fileKey);
    const url = `${baseUrl}/replace-by-specific`;
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => alert(data.message));
  };

  sendNewSpecificValue = () => {
    const { replaceOldValue, replaceNewValue } = this.state;
    const data = new FormData();
    const fileKey = ls.get("workflow_token") || "";
    data.append("oldValue", replaceOldValue);
    data.append("newValue", replaceNewValue);
    data.append("column", this.state.selectedColumn);
    data.append("fileKey", fileKey);
    const url = `${baseUrl}/replace-value`;
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => alert(data.message));
  };

  sendReplaceByMeanMedian = replace_url => {
    const url = `${baseUrl}` + "/" + replace_url;
    const data = new FormData();
    const fileKey = ls.get("workflow_token") || "";
    data.append("columns", JSON.stringify([this.state.selectedColumn]));
    data.append("fileKey", fileKey);
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => alert(data.message));
  };

  getData = topic => {
    const url = `${baseUrl}/get-help`;
    const data = new FormData();
    data.append("topic", topic);
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ modalTopic: topic });
        this.setState({ modalContent: data.description });
        this.setState({ modalShow: true });
      });
  };

    getCharts = (chartType) => {
    const data = new FormData();
    const fileKey = ls.get("workflow_token") || "";
    console.log(fileKey);
    this.setState({ images: [] });
    data.append("fileKey", fileKey);
    data.append("visType", chartType);
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
    const url = `${baseUrl}/visualization`;
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        console.log("getting data", data);
        this.setState({ images: data["images"] });
        if (chartType == "Correlation") {
          console.log("rows we have", data["correlation"]["rows"]);
          this.setState({ correlationRows: data["correlation"]["rows"] });
          const statCols = data["correlation"]["columns"]
            .map(e => {
              return { Header: e, accessor: e };
            })
            .then(statCols =>
              this.setState({
                correlationCols: statCols
              })
            );
        }
      })
      .catch(err => console.log(err));
    if (chartType == "Correlation") {
      this.setState({ displayCorrelation: true });
    } else {
      this.setState({ displayCorrelation: false });
    }
  };

   updateCheck = (e, index) => {
    console.log("e", index);
    const { checker } = this.state;
    checker[index] = !checker[index];
    this.setState({ checker: checker });
    console.log("checker", this.state.checker);
  };

   tranformSTD = () => {
    const data = new FormData();
    const fileKey = ls.get("workflow_token") || "";
    console.log(fileKey);
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
    const url = `${baseUrl}/standard-scale`;
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        console.log("we got", data);
        alert("Your data is updated succesfully!");
      })
      .catch(err => console.log(err));
  };

  selectEvalutionModel = e => {
    this.setState({ valuationType: e.target.value });
    console.log(e.target.value, "eeeee");
  };

  submitData(selectedModel) {
    console.log("Data Submit");
    console.log("selected model", selectedModel);
    const valuation = this.state.evalutionModelValue;
    console.log("valuation", valuation);
    const fileKey = ls.get("workflow_token") || "";
    const required_columns = [];
    const images = [];
    this.state.columns.forEach((column, index) => {
      if (this.state.checker[index] == true) {
        required_columns.push(column);
      }
    });
	if (selectedModel == "") {
		alert("Please choose a model first among the options");
	} else if (selectedModel == "RF") {
      console.log("n esti", this.state.n_estimator);
      console.log("depth", this.state.max_depth);
      const data = new FormData();
      data.append("fileKey", fileKey);
      data.append("valuation", valuation);
      data.append("n_estimator", this.state.n_estimator);
      data.append("max_depth", this.state.max_depth);
      data.append("columns", required_columns);
      data.append("valuationType", this.state.valuationType);
      data.append("target_col", this.state.selectedColumn);
      const url = `${baseUrl}/random-forest`;
      fetch(url, {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(data => {
          console.log("getting data", data);
          if (data.imgFeat) images.push(data.imgFeat);
          if (data.imgROC) images.push(data.imgROC);
          images.push(data.imgConf);
          if (data.report) this.setState({ report: data.report });
          if (data.rmse_scores)
            this.setState({ rmse_scores: data.rmse_scores });
          if (data.mean) this.setState({ mean: data.mean });
          if (data.std) this.setState({ std: data.std });
          if (data.imgErr) images.push(data.imgErr);
          console.log("images we have", images);
        })
        .then(() => {
          this.setState({ images });
        })
        .catch(err => console.log(err));
    } else if (selectedModel == "LR") {
      const data = new FormData();
      data.append("fileKey", fileKey);
      data.append("valuation", valuation);
      data.append("columns", required_columns);
      data.append("valuationType", this.state.valuationType);
      data.append("target_col", this.state.selectedColumn);
      const url = `${baseUrl}/linear-regression`;
      fetch(url, {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(data => {
          console.log("getting data", data);
          if (data.imgFeat) images.push(data.imgFeat);
          if (data.imgROC) images.push(data.linearFit);
          if (data.report) this.setState({ report: data.report });
          if (data.rmse_score) this.setState({ rmse_scores: data.rmse_score });
          if (data.mean) this.setState({ mean: data.mean });
          if (data.std) this.setState({ std: data.std });
          if (data.mse) this.setState({ mse: data.mse });
          if (data.r2s) this.setState({ r2s: data.r2s });
        })
        .then(() => {
          this.setState({ images });
        })

        .catch(err => console.log(err));
    } else if (selectedModel == "HC") {
      const data = new FormData();
      data.append("fileKey", fileKey);
      data.append("columns", required_columns);
      data.append("n_clusters", this.state.n_clusters);
      const url = `${baseUrl}/hierarchical`;
      fetch(url, {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(data => {
          console.log("getting data", data);
          if (data.cluster) images.push(data.cluster);
          if (data.dendrogram) images.push(data.dendrogram);
        })
        .then(() => {
          this.setState({ images });
        })
        .catch(err => console.log(err));
    }
    // console.log("images we have", images);
    this.setState({ images });
  }
  getModelInfo = (selectedModel, fullForm) => {
    console.log("button clicked");
	if (selectedModel == "") {
		alert("Please choose a model first among the options");
	} else {
    const topic = selectedModel;
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
        this.setState({ modalTopic: fullForm });
        this.setState({ modalShow: true });
      });
	 }
  };

  render () {
  const { evalutionModel } = this.state;

    let evalutionModelList =
      evalutionModel.length > 0 &&
      evalutionModel.map((item, i) => {
        return (
          <option key={i} value={item.id}>
            {item.name}
          </option>
        );
      }, this);

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
          {this.state.chartType == "Correlation" ? (
            <h4 style={{ textAlign: "center", paddingLeft: 30, paddingTop: 20 }}>
              Correlation
            </h4>
          ) : null}
          {renderIf(this.state.displayCorrelation == true)(
            <JsonToTable
              style={{ marginLeft: "15%", height: "200px" }}
              json={this.state.correlationRows}
            />
          )}{" "}
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
				<Button onClick={() => this.addNodeToDiagram("Structured Data Preprocessing")}>Structured Data Preprocessing</Button>				
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
            <Button
              type="button"
              onClick={() => this.uploadFile()}
            >Submit File</Button>
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
			display: "none"}} id="Structured Data Preprocessing">
			<div>
            <span
              style={{
                position: "relative",
                left: "30%",
                top: "10px"
              }}
            >
			<Button onClick={() => this.getColumns()}>
					  Display all columns for Select Option
				</Button>
              <b>Select Column: </b>{" "}
              <select onChange={e => this.statsByColumns(e)}>
                <option>--Select--</option>
                {this.state.columns.map((item, key) => (
                  <option>{item}</option>
                ))}
              </select>
            </span>
          </div>
          <br />
          <br />

          <div class="box4">
            <h3>
              <u>Cleaning Process</u>
            </h3>
            <table>
              <tr>
                <td>Remove Missing Values</td>
                <td style={{ width: 200 }}>
                  <input
                    type="checkbox"
                    onChange={() =>
                      this.setState({
                        removeMissing: !this.state.removeMissing
                      })
                    }
                  />
                </td>
				</tr>
				<tr>
                <td>
                  <Button onClick={() => this.sendRemoveMissing()}>
                    Submit
                  </Button>
                </td>
				</tr>
				<tr>
                <input
                  type="button"
                  value="Help!"
                  onClick={() => this.getData("remove-missing")}
                />
              </tr>
              <tr>
			  </tr>
              <tr>
                <td>Remove Outside of Range</td>
			  </tr>
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
				  </td>
              </tr>
			  <tr>
				<td>
                  <input
                    type="text"
                    placeholder={this.state.removeRangeMaxValue}
                    style={{ width: "90px" }}
                    onChange={e =>
                      this.setState({ removeRangeMaxValue: e.target.value })
                    }
                  />
                </td>
				</tr>
				<tr>
                <td>
                  <Button onClick={() => this.sendRemoveRange()}>Submit</Button>
                </td>
				</tr>
				<tr>
                <input
                  type="button"
                  value="Help!"
                  onClick={() => this.getData("remove-range")}
                />
              </tr>
              <tr>
			  </tr>
				<tr>
                <td>Replace NAN By Specific Value</td>
			 </tr>
			 <tr>
                <td style={{ width: 200 }}>
                  <input
                    type="text"
                    placeholder={this.state.replaceSpecificValue}
                    style={{ width: "190px" }}
                    onChange={e =>
                      this.setState({ replaceSpecificValue: e.target.value })
                    }
                  />{" "}
                </td>
			</tr>
			<tr>
                <td>
                  <Button onClick={() => this.sendSpecificValue()}>
                    Submit
                  </Button>
                </td>
			</tr>
			<tr>
                <input
                  type="button"
                  value="Help!"
                  onClick={() => this.getData("replace-nan")}
                />
              </tr>
              <tr>
			  </tr>
              <tr>
                <td>Replace Specific Value</td>
			  </tr>
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="Old Value"
                    style={{ width: "90px" }}
                    onChange={e =>
                      this.setState({ replaceOldValue: e.target.value })
                    }
                  />{" "}
				</td>
               </tr>
              <tr>
			  <td>
                  <input
                    type="text"
                    placeholder="New Value"
                    style={{ width: "90px" }}
                    onChange={e =>
                      this.setState({ replaceNewValue: e.target.value })
                    }
                  />{" "}
                </td>
			</tr>
              <tr>
                <td>
                  <Button onClick={() => this.sendNewSpecificValue()}>
                    Submit
                  </Button>
                </td>
				</tr>
              <tr>
                <Button onClick={() => this.getData("remove-range")}>
                  Help!
                </Button>
              </tr>
              <tr>
			   </tr>
              <tr>
                <td>Replace Missing Values by Mean</td>
			 </tr>
              <tr>
                <td>
                  <Button
                    onClick={() =>
                      this.sendReplaceByMeanMedian("replace-by-mean")
                    }
                  >
                    Submit
                  </Button>
                </td>
				</tr>
              <tr>
                <Button onClick={() => this.getData("remove-range")}>
                  Help!
                </Button>
              </tr>
              <tr>
			   </tr>
              <tr>
                <td>Replace Missing Values by Median</td>
				</tr>
              <tr>
                <td>
                  <Button
                    onClick={() =>
                      this.sendReplaceByMeanMedian("replace-by-median")
                    }
                  >
                    Submit
                  </Button>
                </td>
				</tr>
              <tr>
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

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Histogram">
				
        <Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <Button onClick={() => this.getCharts("histogram")}>Generate Histogram</Button>
          </Col>
		  </Row>

		  <Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <Button onClick={() => this.getHelp("Histogram")}>Get info</Button>
          </Col>
        </Row>
       
			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Correlation">

        <Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <Button onClick={() => this.getCharts("Correlation")}>Generate Correlation Matrix</Button>
          </Col>
		  </Row>

		  <Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <Button onClick={() => this.getHelp("Correlation")}>Get info</Button>
          </Col>
        </Row>


			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Box Plot">

        <Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <Button onClick={() => this.getCharts("Box Plot")}>Generate Box Plot</Button>
          </Col>
		  </Row>

		  <Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <Button onClick={() => this.getHelp("Box Plot")}>Get info</Button>
          </Col>
        </Row>

			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Applied PCA">

        <Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <Button onClick={() => this.getCharts("Apply PCA")}>Applied PCA</Button>
          </Col>
		  </Row>

		  <Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <Button onClick={() => this.getHelp("PCA")}>Get info</Button>
          </Col>
        </Row>

			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Standard Scaling">

			<Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <Button onClick={() => this.tranformSTD()}>Perform Standard Scaling</Button>
          </Col>
		  </Row>

		  <Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <Button onClick={() => this.getData("standard-scaling")}>Get info</Button>
          </Col>
        </Row>

			</div>

		<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Min-Max Scaling">

			<Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <Button onClick={() => this.tranformSTD()}>Perform Min-Max Scaling</Button>
          </Col>
		  </Row>

		  <Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <Button onClick={() => this.getData("standard-scaling")}>Get info</Button>
          </Col>
        </Row>

			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Evaluation model">
			<Row>
			<select onChange={this.selectEvalutionModel}>
                {evalutionModelList}
              </select>
			</Row>
			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Linear Regression">
			<Row>
				Select target variable:
               <select onChange={e => this.statsByColumns(e)}>
                <option>--Select--</option>
                {this.state.columns.map((item, key) => (
                  <option>{item}</option>
                ))}
              </select>
            </Row>
			<br/>
			<Row>
              <input
                type="button"
                value="Generate Linear Regression Model"
                onClick={() => this.submitData("LR")}
              />
            </Row>
			<br/>
            <Row>
              <button
                class="btn btn-info"
                type="button"
                value="Help!"
                onClick={() => this.getModelInfo("LR", "Linear Regression")}
              >
                Get Info about chosen model
              </button>
            </Row>

			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Random Forest">
			<Row>
				Select target variable:
               <select onChange={e => this.statsByColumns(e)}>
                <option>--Select--</option>
                {this.state.columns.map((item, key) => (
                  <option>{item}</option>
                ))}
              </select>
            </Row>
			<br/>
			<Row>
            Enter the value for n_estimator parameter
            </Row>

          <Row>
              <input
                type="text"
                onChange={e => this.setState({ n_estimator: e.target.value })}
              />
          </Row>
		  <br/>
          <Row>
            Enter the value for max depth parameter
			</Row>
           <Row>
              <input
                type="text"
                onChange={e => this.setState({ max_depth: e.target.value })}
              />
          </Row>
		  <br/>
			<Row>
              <input
                type="button"
                value="Generate Random Forest Model"
                onClick={() => this.submitData("RF")}
              />
            </Row>
			<br/>
            <Row>
              <button
                class="btn btn-info"
                type="button"
                value="Help!"
                onClick={() => this.getModelInfo("RF", "Random Forest")}
              >
                Get Info about chosen model
              </button>
            </Row>

			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Support Vector Machine">

			<Row>
              <input
                type="button"
                value="Generate Support Vector Machine Model"
                onClick={() => this.submitData("SVM")}
              />
            </Row>
			<br/>
            <Row>
              <button
                class="btn btn-info"
                type="button"
                value="Help!"
                onClick={() => this.getModelInfo("SVM", "Support Vector Machine")}
              >
                Get Info about chosen model
              </button>
            </Row>
			
			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="K-Nearest Neighbor">

			<Row>
              <input
                type="button"
                value="Generate K-Nearest Neighbor Model"
                onClick={() => this.submitData("KNN")}
              />
            </Row>
			<br/>
            <Row>
              <button
                class="btn btn-info"
                type="button"
                value="Help!"
                onClick={() => this.getModelInfo("KNN", "K-Nearest Neighbor")}
              >
			  Get Info about chosen model
              </button>
            </Row>

			</div>

			<div style={{
            align: "center",
            marginLeft: "80%",
            marginTop: "10px",
			display: "none"}} id="Multilayer Perceptron">

			<Row>
              <input
                type="button"
                value="Generate Multilayer Perceptron Model"
                onClick={() => this.submitData("MP")}
              />
            </Row>
			<br/>
            <Row>
              <button
                class="btn btn-info"
                type="button"
                value="Help!"
                onClick={() => this.getModelInfo("MP", "Multilayer Perceptron")}
              >
			   Get Info about chosen model
              </button>
            </Row>


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

  export default Workflow3;