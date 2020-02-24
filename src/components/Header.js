import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#3b5998",
          textAlign: "center",
          fontSize: "25px",
          fontWeight: "bold",
          color: "white"
        }}
      >
        Data Mining Tool
      </div>
    );
  }
}

export default Header;
