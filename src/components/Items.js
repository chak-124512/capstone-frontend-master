import React, { Component } from "react";

class Items extends Component {
  state = {
	currentDisplay : "csvUpload"
  };
  changeButtonColorAndChangeDisplay(id) {
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
        <div id="csvUpload"
          style={{
            backgroundColor: "#61ddff",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",

            paddingTop: "5px",
            paddingBottom: "5px"
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
        <div id="preProcessing"
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
          onClick={e => this.changeButtonColorAndChangeDisplay("preProcessing")}
        >
          Preprocessing Data
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
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("transformation")}
        >
          Data Tranformation
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
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("mining")}
        >
          Data Mining
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
