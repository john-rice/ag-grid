import { GridApi, createGrid, GridOptions } from '@ag-grid-community/core';

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: 'athlete', minWidth: 150 },
    { field: 'age', maxWidth: 90 },
    { field: 'country', minWidth: 150 },
    { field: 'year', maxWidth: 90 },
    { field: 'date', minWidth: 150 },
    { field: 'sport', minWidth: 150 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    editable: true,
    cellDataType: false,
  },
  enableRangeSelection: true,
  enableFillHandle: true,
  fillHandleDirection: 'x',
}

function fillHandleAxis(direction: 'x' | 'y' | 'xy') {
  var buttons = Array.prototype.slice.call(
    document.querySelectorAll('.ag-fill-direction')
  )
  var button = document.querySelector('.ag-fill-direction.' + direction)!

  buttons.forEach(function (btn) {
    btn.classList.remove('selected')
  })

  button.classList.add('selected')
  gridApi!.setFillHandleDirection(direction)
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  gridApi = createGrid(gridDiv, gridOptions);

  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(response => response.json())
    .then((data: IOlympicData[]) => gridApi!.setRowData(data))
})
