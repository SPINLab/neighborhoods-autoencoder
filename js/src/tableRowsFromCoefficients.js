export default function updateRows(tableBody, coefficients) {
  tableBody.innerHTML = '';

  return coefficients.forEach((ellipse) => {
    const tableRow = tableBody.insertRow();

    return ellipse.forEach((coefficient) => {
      const newCell = tableRow.insertCell(-1);
      const cellContents = document.createTextNode(coefficient.toPrecision(8));
      newCell.appendChild(cellContents);
    });
  });
}
