function showTableError(message) {
  const table = document.getElementById('csv-table');
  table.innerHTML = `
    <tr>
      <td colspan="99" class="table-error">${message}</td>
    </tr>
  `;
}

fetch('data/WNC_GT7_RAW.csv')
  .then(response => {
    if (!response.ok) {
      showTableError("Error: CSV file not found.");
      throw new Error("CSV not found");
    }
    return response.text();
  })
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      error: function(err) {
        showTableError("Error parsing CSV: " + err.message);
      },
      complete: function(results) {
        const data = results.data;

        if (!data.length) {
          showTableError("Error: CSV file is empty.");
          return;
        }

        const table = document.getElementById('csv-table');

        // Build header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        Object.keys(data[0]).forEach(col => {
          const th = document.createElement('th');
          th.textContent = col;
          headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Build body
        const tbody = document.createElement('tbody');

        data.forEach(row => {
          const tr = document.createElement('tr');
          Object.values(row).forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });

        table.appendChild(tbody);
      }
    });
  })
  .catch(err => {
    showTableError("Network error loading CSV.");
  });
