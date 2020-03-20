import React, { Component } from "react";
import Upload from "./upload";
import Header from "./Header";
import Items from "./Items";
import Content from "./Content";
class Main extends Component {
  state = {
    display: "uploadUnstructured"
  };
  changeDisplay = e => {
    this.setState({ display: e });
    console.log('display---', e);
  };
  changeDisplayToWorkflow = e => {
    this.setState({ display: e });
    console.log('display---', e);
  };
  changeDisplayToWorkflow2 = e => {
    this.setState({ display: e });
    console.log('display---', e);
  };
  changeDisplayToWorkflow3 = e => {
    this.setState({ display: e });
    console.log('display---', e);
  };
  changeDisplayToWorkflow4 = e => {
    this.setState({ display: e });
    console.log('display---', e);
  };
  render() {
    return (
      <React.Fragment>
        {/* <div style={{ backgroundColor: "#E8E8E8E8" }}> */}
        <Header />
        <Items changeDisplay={e => this.changeDisplay(e)} />
        <Content
          changeDisplay={e => this.changeDisplay("displayContent")}
		  changeDisplayToWorkflow={e => this.changeDisplayToWorkflow("workflow")}
		  changeDisplayToWorkflow2={e => this.changeDisplayToWorkflow("workflow2")}
		  changeDisplayToWorkflow3={e => this.changeDisplayToWorkflow("workflow3")}
		  changeDisplayToWorkflow4={e => this.changeDisplayToWorkflow("workflow4")}
          display={this.state.display}
        />
      </React.Fragment>
    );
  }
}

export default Main;
