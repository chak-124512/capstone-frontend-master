import React, { Component } from "react";
import Upload from "./upload";
import Header from "./Header";
import Items from "./Items";
import Content from "./Content";
class Main extends Component {
  state = {
    display: "csvUpload"
  };
  changeDisplay = e => {
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
          display={this.state.display}
        />
      </React.Fragment>
    );
  }
}

export default Main;
