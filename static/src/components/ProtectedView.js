import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/data';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-root/dist/styles/ag-grid.css';
import 'ag-grid-root/dist/styles/theme-material.css'

import io from 'socket.io-client'


function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
        documents: state.data.documents,
        isConnected: state.data.isConnected,

    };
}


const mapDispatchToProps = dispatch => ({
  fetchProtectedData: token => dispatch(actions.fetchProtectedData(token)),
  addListenersTo: events => dispatch(actions.addListenersTo(events)),
});


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
        rowData: [],
        columnDefs: this.createColumnDefs(),
        enableFilter: true,
        rowHeight: 48,
        rowCount: null,
        rowGetter: null,
        statusMessage: null
    };
  }

  createColumnDefs() {

        var columnDefs = [
          {headerName: "Title", field: "file_id", checkboxSelection: true},
          {headerName: "Versions", field: "version",
           cellRendererFramework: NameCellRenderer}
        ];

        return columnDefs;
    }

  componentWillMount() {
    this.props.addListenersTo(['ADD_DOCUMENT', 'action' ]);

  }

  componentDidMount() {
      this.fetchData();
      this.setState({rowData: this.state.documents});
      console.log(this.props.documents)
  }

  componentWillUnmount() {
    console.log("Unmounting like a boss")
  }

  fetchData() {
      const token = this.props.token;
      this.props.fetchProtectedData(token);
  }

  onGridReady(params) {
      this.api = params.api;
      this.columnApi = params.columnApi;
  }

  render() {
    const message = this.state.statusMessage
    return (
         <div>
            {message}
            {!this.props.loaded
                ? <h1>Loading data...</h1>
                :
                  <div className="ag-material">
                  <AgGridReact

                  // listen for events with React callbacks
                  // onRowSelected={this.onRowSelected.bind(this)}
                  // onCellClicked={this.onCellClicked.bind(this)}

                  // binding to properties within React State or Props
                  // showToolPanel={this.state.showToolPanel}
                  // quickFilterText={this.state.quickFilterText}
                  // icons={this.state.icons}

                  // column definitions and row data are immutable, the grid
                  // will update when these lists change
                  columnDefs={this.state.columnDefs}
                  rowData={this.props.documents}

                  // or provide props the old way with no binding
                  rowSelection="multiple"
                  enableSorting="true"
                  enableFilter="true"
                  rowHeight="48"

                  onGridReady={this.onGridReady.bind(this)}
                />
                </div>
            }
        </div>
    );
  }
}




ProtectedView.propTypes = {
    fetchProtectedData: React.PropTypes.func,
    addListenersTo: React.PropTypes.func,
    addDocuments: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
    documents: React.PropTypes.any
};
