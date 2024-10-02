// Your Published Google Sheet CSV URL
const sheetCSVUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRqdssBlNxXmm5t5PtVQaWybmauGy47bWgiOk8KDEHTMopRDRGiygURWiM12jUXCFzoTqtekqSdquA3/pub?gid=0&single=true&output=csv';

// Function to fetch CSV data
async function fetchCSVData() {
    const response = await fetch(sheetCSVUrl);
    const data = await response.text();
    return data;
}

// Function to convert CSV to 2D array
function csvToArray(str, delimiter = ",") {
    const rows = str.split("\n");
    return rows.map(row => row.split(delimiter));
}

// Function to populate table with data
function populateTable(data) {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    
    // Clear the table
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    // Create headers from the first row
    const headers = data[2];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeader.appendChild(th);
    });

    // Create rows for the rest of the data
    data.slice(3).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach((cell, index) => {
            const td = document.createElement('td');
            td.textContent = cell;

            // Apply conditional formatting to the last column (assuming it's yes/no)
            if (index === row.length - 1) {  // Check if this is the last column of the current row
                if (cell.trim().toLowerCase() === 'yes') {
                    td.classList.add('yes');
                } else if (cell.trim().toLowerCase() === 'no') {
                    td.classList.add('no');
                }
            }

            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

// Function to search and filter table rows
function searchTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const table = document.getElementById('dataTable');
    const tr = table.getElementsByTagName('tr');
    
    for (let i = 1; i < tr.length; i++) {
        const tdArray = tr[i].getElementsByTagName('td');
        let rowContainsFilter = false;

        for (let td of tdArray) {
            if (td.textContent.toLowerCase().indexOf(filter) > -1) {
                rowContainsFilter = true;
                break;
            }
        }

        tr[i].style.display = rowContainsFilter ? '' : 'none';
    }
}

// Fetch and display data on page load
window.onload = async () => {
    const csvData = await fetchCSVData();
    const dataArray = csvToArray(csvData);
    populateTable(dataArray);
};