import "./styles.css";

import { AgGridColumn, AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import { ClinCellEditor } from "./BasicCellEditor";
export default function App() {
  const rowData = [
    { make: "Toyota", model: "Celica", price: 3 },
    { make: "Ford", model: "Mondeo", price: 3200 },
    { make: "Porsche", model: "Boxter", price: 7200 }
  ];

  return (
    <div className="App">
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          rowData={rowData}
          frameworkComponents={{
            clinCellEditor: ClinCellEditor
          }}
          stopEditingWhenCellsLoseFocus={true}
        >
          <AgGridColumn field="make"></AgGridColumn>
          <AgGridColumn field="model"></AgGridColumn>
          <AgGridColumn
            field="price"
            sortable={true}
            cellEditor="clinCellEditor"
            editable={true}
          ></AgGridColumn>
        </AgGridReact>
      </div>
    </div>
  );
}
