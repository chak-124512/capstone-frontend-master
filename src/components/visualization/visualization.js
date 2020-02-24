import React, { Component } from "react";
import InputForm from "./inputForm";
import Graphs from "./graph";

class Visualization extends Component {
  render() {
    return (
      <React.Fragment>
        <table>
          <tbody> 
          <tr>
            <td>
              <InputForm />
            </td>
            <td>
              <Graphs />
            </td>
          </tr>
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default Visualization;
