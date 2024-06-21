// Function to fetch all addresses and populate the list
function findAllAddresses() {
    fetch('http://localhost:8080/api/v1/address/return-all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'dataBase': 'MYSQL'
        }
    })
        .then(response => response.json())
        .then(addresses => populateAddressList(addresses))
        .catch(error => console.error('Error fetching addresses:', error));
}

// Function to populate the address list
function populateAddressList(addresses) {
    const addressList = document.getElementById('addressList');
    addressList.innerHTML = ''; // Clear the list before adding new data

    // Function to format the date
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    }

    // Populate address data into the table
    addresses.forEach(address => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${address.id}</td>
            <td>${address.number}</td>
            <td>${address.street}</td>
            <td>${address.neigborhood}</td>
            <td>${address.city.description}</td>
            <td>${address.state.description}</td>
            <td>${address.country.description}</td>
            <td>${formatDate(address.createdAt)}</td>
            <td>${address.updatedAt ? formatDate(address.updatedAt) : 'No update'}</td>
            <td>${address.disabledAt ? formatDate(address.disabledAt) : ''}</td>
            <td>
                <button onclick="disableAddress(${address.id})">Disable</button>
                <button onclick="redirectToAddressEdit(${address.id})">Edit</button>
            </td>
        `;
        addressList.appendChild(row);
    });
}

// Function to disable an address
function disableAddress(addressId) {
    fetch('http://localhost:8080/api/v1/address/disable', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'dataBase': 'MYSQL',
            'idAddressToDisable': addressId
        }
    })
        .then(response => response.json())
        .then(() => {
            alert('Address disabled successfully.');
            findAllAddresses(); // Refresh address list after disabling
        })
        .catch(error => console.error('Error disabling address:', error));
}

// Function to redirect to the address edit page
function redirectToAddressCreation(addressId) {
    window.location.href = `form.html`;
}

// Function to redirect to the user edit page
function redirectToAddressEdit(userId) {
    window.location.href = `form.html?addressId=${userId}`;
}

function searchAddress() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const rows = document.querySelectorAll('#addressTable tbody tr');

    rows.forEach(row => {
        let found = false;
        row.childNodes.forEach(cell => {
            if (cell.textContent.toUpperCase().includes(filter)) {
                found = true;
            }
        });
        if (found) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// On page load, fetch all addresses and populate the list
window.onload = findAllAddresses;
