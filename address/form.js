// Function to save or update address data
function saveOrUpdateAddress(addressData, addressId = null) {
    const url = addressId ? `http://localhost:8080/api/v1/address/update` : 'http://localhost:8080/api/v1/address/create';
    const method = addressId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'dataBase': 'MYSQL',
            'idAddressToUpdate': `${addressId}`
        },
        body: JSON.stringify(addressData)
    })
    .then(response => response.json())
    .then(() => {
        alert(addressId ? 'Address updated successfully.' : 'Address created successfully.');
        redirectToAddressList(); // Redirect to address list after saving/updating
    })
    .catch(error => console.error('Error saving/updating address:', error));
}

// Function to fetch address data by ID for editing
function fetchAddressDataForEdit(addressId) {
    fetch(`http://localhost:8080/api/v1/address/find-by-id`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'dataBase': 'MYSQL',
            'id': `${addressId}`
        }
    })
    .then(response => response.json())
    .then(address => {
        populateAddressForm(address); // Populate form with address data
    })
    .catch(error => console.error('Error fetching address data for edit:', error));
}

// Function to populate address form with existing data for editing
function populateAddressForm(address) {
    document.getElementById('country').value = address.country.description || '';
    document.getElementById('state').value = address.state.description || '';
    document.getElementById('city').value = address.city.description || '';
    document.getElementById('neigborhood').value = address.neigborhood || '';
    document.getElementById('street').value = address.street || '';
    document.getElementById('number').value = address.number || '';
}

// Function to handle form submission (create/update address)
function handleAddressFormSubmission(event) {
    event.preventDefault();
    
    const addressData = {
        country: { description: document.getElementById('country').value },
        state: { description: document.getElementById('state').value },
        city: { description: document.getElementById('city').value },
        neigborhood: document.getElementById('neigborhood').value,
        street: document.getElementById('street').value,
        number: document.getElementById('number').value
    };

    const urlParams = new URLSearchParams(window.location.search);
    const addressId = urlParams.get('addressId');

    if (addressId) {
        saveOrUpdateAddress(addressData, addressId); // Update address if addressId is present
    } else {
        saveOrUpdateAddress(addressData); // Create address if addressId is not present
    }
}

// On page load, check if address edit mode is active and fetch address data for editing
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const addressId = urlParams.get('addressId');
    
    if (addressId) {
        fetchAddressDataForEdit(addressId); // Fetch address data if addressId is present in URL
    }
};

// Function to redirect to address list page
function redirectToAddressList() {
    window.location.href = 'list.html';
}

// Event listener for form submission
document.getElementById('addressForm').addEventListener('submit', handleAddressFormSubmission);
