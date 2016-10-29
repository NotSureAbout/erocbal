import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/data';

import TextField from 'material-ui/TextField';
import {AgGridReact} from 'ag-grid-react';
import {reactCellRendererFactory} from 'ag-grid-react';
import SimpleCellRenderer from './simpleCellRenderer.js';
import 'ag-grid-root/dist/styles/ag-grid.css';
import 'ag-grid-root/dist/styles/theme-material.css';
import io from 'socket.io-client'

import Pdf from 'react-pdf-js';

function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

// React cellRenderer Component
class NameCellRenderer extends React.Component {
    render() {
        // or access props using 'this'
        return <span>{this.props.value}</span>;
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProtectedView extends React.Component {
  constructor() {
    super();

    this.state = {
        columnDefs: this.createColumnDefs(),
        rowData: [],
        enableFilter: true,
        rowHeight: 48,
        quickFilterText: null,
        statusMessage: null
    };
  }


  createColumnDefs() {

      var columnDefs = [
        {headerName: "Title", field: "digest", checkboxSelection: true},
        {headerName: "Version", field: "version", cellRendererFramework: NameCellRenderer},
        {headerName: "Read", field: "doc_id"}
      ];

      return columnDefs;
  }

  componentDidMount() {
      // Data should be fetched in a reducer
      this.fetchData();
      // var namespace ="/test"
      // var socket = io.connect('http://localhost:5000/');
      //
      // socket.on('status', (msg) => {
      //   this.setState({rowData: JSON.parse(msg.data)});
      // });
      // socket.on('new document', (msg) => {
      //   this.api.addItems(JSON.parse(msg.data))
      // });
  }

  // onGridReady, store the api for later use
  onGridReady(params) {
      this.api = params.api;
      this.columnApi = params.columnApi;
  }

  fetchData() {
      const token = this.props.token;
      this.props.fetchProtectedData(token);
  }

  onQuickFilterText(event) {
      this.setState({quickFilterText: event.target.value});
  }

  render() {

    const message = this.state.statusMessage
    return (
         <div>
            {message}
            {!this.props.loaded
                ? <h1>Loading data...</h1>
                :
                  <div>
                    <TextField
                      hintText="Search"
                      floatingLabelText="Filter"
                      type="filter"
                      onChange={this.onQuickFilterText.bind(this)}
                    />
                    <div className="ag-material">
                      <AgGridReact columnDefs={this.state.columnDefs}
                                   rowData={this.state.rowData}
                                   enableFilter={this.state.EnableFilter}
                                   rowHeight={this.state.rowHeight}
                                   quickFilterText={this.state.quickFilterText}
                                   rowSelection= "multiple"
                                   onGridReady={this.onGridReady.bind(this)}
                                   />
                    </div>
                </div>
            }
        </div>
    );
  }
}

ProtectedView.propTypes = {
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
