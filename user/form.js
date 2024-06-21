// Function to save or update user data
function saveOrUpdateUser(userData, userId = null) {
    const url = userId ? `http://localhost:8080/api/v1/user/update` : 'http://localhost:8080/api/v1/user/create';
    const method = userId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'dataBase': 'MYSQL',
            'userId': `${userId}`
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(() => {
        alert(userId ? 'User updated successfully.' : 'User created successfully.');
        redirectToUserList(); // Redirect to user list after saving/updating
    })
    .catch(error => console.error('Error saving/updating user:', error));
}

// Function to fetch user data by ID for editing
function fetchUserDataForEdit(userId) {
    fetch(`http://localhost:8080/api/v1/user/find-by-id`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'dataBase': 'MYSQL',
            'userId': `${userId}`
        }
    })
    .then(response => response.json())
    .then(user => {
        populateUserForm(user); // Populate form with user data
    })
    .catch(error => console.error('Error fetching user data for edit:', error));
}

// Function to populate user form with existing data for editing
function populateUserForm(user) {
    document.getElementById('name').value = user.name || '';
    document.getElementById('document').value = user.document || '';
    document.getElementById('username').value = user.username || '';
    document.getElementById('password').value = user.password || '';
}

// Function to handle form submission (create/update user)
function handleFormSubmission(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        document: document.getElementById('document').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    if (userId) {
        saveOrUpdateUser(userData, userId); // Update user if userId is present
    } else {
        saveOrUpdateUser(userData); // Create user if userId is not present
    }
}

// On page load, check if user edit mode is active and fetch user data for editing
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    
    if (userId) {
        fetchUserDataForEdit(userId); // Fetch user data if userId is present in URL
    }
};

// Function to redirect to user list page
function redirectToUserList() {
    window.location.href = 'list.html';
}

// Event listener for form submission
document.getElementById('userForm').addEventListener('submit', handleFormSubmission);
