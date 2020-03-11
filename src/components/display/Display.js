import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { format } from "./tableFormat";
import { connect } from "react-redux";
import { sampleData, sampleRowData } from "./displaytest2";
import ls from "local-storage";
import { baseUrl } from "../../shared/baseUrl";
class Display extends Component {
  state = {
    columns: [],
    statsCols: ["Name"],
    statsData: []
  };
  componentDidMount() {
    this.getstatistics();
    this.props.updateData();
  }

  async getstatistics() {
    const data = new FormData();
    data.append("fileKey", ls.get("token"));
    const request = await fetch(`${baseUrl}/stats`, {
      method: "POST",
      body: data
    });

    const rowData = await request.json();
    const table = rowData.table;
    const statsCols = Object.keys(table[0]);
    this.setState({ statsCols });
    this.setState({ statsData: table });
    console.log("stats we got", table);
    console.log("columns for it", this.state.statsCols);
  }

  render() {
    const { data } = this.props;
    const columns = this.props.cols.map(e => {
      return { Header: e, accessor: e };
    });

    const statCols = this.state.statsCols.map(e => {
      return { Header: e, accessor: e };
    });
    return (
      <div>
        <h4 style={{ textAlign: "center", padding: "-5px" }}>Data</h4>
        <ReactTable data={data} columns={columns} />
        <h4 style={{ textAlign: "center", padding: "-5px" }}>Statistics</h4>
        <ReactTable
          style={{ marginLeft: "15%", height: "200px" }}
          data={this.state.statsData}
          columns={statCols}
        />
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
)(Display);
