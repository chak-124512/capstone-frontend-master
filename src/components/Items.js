import React, { Component } from "react";

class Items extends Component {
  state = {
	currentDisplay : "uploadUnstructured"
  };
  changeButtonColorAndChangeDisplay = (id) => {
	var backgroundColor = document.getElementById(this.state.currentDisplay).style.backgroundColor;
	// check if button color and display was changed outside this method - currentDisplay would not have changed
	if (backgroundColor == "rgb(59, 89, 152)") {
		document.getElementById("displayContent").style.backgroundColor = "#3b5998";
	} else {
	  	document.getElementById(this.state.currentDisplay).style.backgroundColor = "#3b5998";
	}
	document.getElementById(id).style.backgroundColor = "#61ddff";
	// change the currentDisplay 
	this.setState({ currentDisplay : id });
	this.props.changeDisplay(id);
  };

  showButtons = () => {
	if (document.getElementById("csvUpload").style.display == "none") {
		// change from unstructured file view to stuctured file view
		document.getElementById("csvUpload").style.display = "";
		document.getElementById("uploadUnstructured").style.display = "none";
		document.getElementById("transformation").style.display = "";
		document.getElementById("preProcessing").style.display = "";
		document.getElementById("preProcessingUnstructured").style.display = "none";
		document.getElementById("mining").style.display = "";
		document.getElementById("miningUnstructured").style.display = "none";
		// change from tabs that won't be visible in unstructured file view
		if (this.state.currentDisplay=="uploadUnstructured") {
			this.changeButtonColorAndChangeDisplay("csvUpload");
		} else if (this.state.currentDisplay=="preProcessingUnstructured") {
			this.changeButtonColorAndChangeDisplay("preProcessing");
		} else if (this.state.currentDisplay=="miningUnstructured") {
			this.changeButtonColorAndChangeDisplay("mining");
		}
	} else {
		// change from structured file view to unstuctured file view
		document.getElementById("csvUpload").style.display = "none";
		document.getElementById("uploadUnstructured").style.display = "";
		document.getElementById("transformation").style.display = "none";
		document.getElementById("preProcessing").style.display = "none";
		document.getElementById("preProcessingUnstructured").style.display = "";
		document.getElementById("mining").style.display = "none";
		document.getElementById("miningUnstructured").style.display = "";
		// change from tabs that won't be visible in structured file view
		if (this.state.currentDisplay=="csvUpload" || this.state.currentDisplay=="transformation") {
			this.changeButtonColorAndChangeDisplay("uploadUnstructured");
		} else if (this.state.currentDisplay=="preProcessing") {
			this.changeButtonColorAndChangeDisplay("preProcessingUnstructured");
		} else if (this.state.currentDisplay=="mining") {
			this.changeButtonColorAndChangeDisplay("miningUnstructured");
		}
	}
  };

  render() {
    return (
      <div
        style={{
          width: "15vw",
          height: "110vh",
          // backgroundColor: "#0078FF",
          borderRight: "1px solid black",
          float: "left",
          paddingTop: "10px",
          color: "white",
        }}
      >

	  <p style={{margin: "10px", fontSize:"20px", color: "black"}} > File structured? 
		<label class="switch">
			<input type="checkbox" id="togBtn" onChange={this.showButtons} />
				<div class="slider round">
					<span class="on">YES</span>
					<span class="off">NO</span>
				</div>
			</label>
		</p>

		<div id="uploadUnstructured"
          style={{
            backgroundColor: "#61ddff",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("uploadUnstructured")}
        >
          Upload Unstructured Files
        </div>

		<div id="csvUpload"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "5px",
			display: "none"

          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("csvUpload")}
        >
          Upload Structured File
        </div>

        <div id="displayContent"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("displayContent")}
        >
          Display Data
        </div>

        <div id="preProcessingUnstructured"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("preProcessingUnstructured")}
        >
          Preprocessing Unstructured Data
        </div>

		<div id="preProcessing"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px",
			display: "none"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("preProcessing")}
        >
          Preprocessing Structured Data
        </div>


        <div id="visualization"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("visualization")}
        >
          Data Visualization
        </div>

        <div id="transformation"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px",
			display: "none"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("transformation")}
        >
          Data Tranformation
        </div>

		<div id="miningUnstructured"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("miningUnstructured")}
        >
          Data Mining - Unstructured
        </div>

        <div id="mining"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px",
			display: "none"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("mining")}
        >
          Data Mining - Structured
        </div>

		 <div id="workflow"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("workflow")}
        >
          Create Workflow
        </div>

        <div id="codebox"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("codebox")}
        >
          Your Code Box
        </div>

      </div>
    );
  }
}

export default Items;
