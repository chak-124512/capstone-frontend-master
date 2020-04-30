import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { connect } from "react-redux";
import { sampleData, sampleRowData } from "./displaytest2";
import ls from "local-storage";
import { baseUrl } from "../../shared/baseUrl";

class Display2 extends Component {
  state = {
    columns: []
  };
  componentDidMount() {
    const fileKey = ls.get("token_unstructured") || "";
	if (fileKey != "") {
		this.getstatistics(fileKey);
		this.props.updateData();
	} else {
		alert("No unstructured file has been uploaded!");
	}
  }

  async getstatistics(fileKey) {
    const data = new FormData();
    data.append("fileKey", fileKey);
    const request = await fetch(`${baseUrl}/stats`, {
      method: "POST",
      body: data
    });

    const rowData = await request.json();
    const table = rowData.table;
    console.log("table we got", table);
  }

  render() {
    const { data } = this.props;
    const columns = this.props.cols.map(e => {
      return { Header: e, accessor: e };
    });

    return (
      <div>
        <h4 style={{ textAlign: "center", padding: "-5px" }}>Data</h4>
        <ReactTable data={data} columns={columns} />
      </div>
    );
  }
}
const mapStateToProps = state => {
  // console.log(state.action.payload.colData);
  return {
    data: state ? state.action.payload.rowData : [],
    cols: state ? state.action.payload.colData : []
  };
};
export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(Display2);
