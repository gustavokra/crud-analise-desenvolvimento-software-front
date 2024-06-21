// Function to fetch all users and populate the list
function findAllUsers() {
    fetch('http://localhost:8080/api/v1/user/return-all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'dataBase': 'MYSQL'
        }
    })
        .then(response => response.json())
        .then(users => populateUserList(users))
        .catch(error => console.error('Error fetching users:', error));
}

// Function to populate the user list
function populateUserList(users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // Limpa a lista antes de adicionar novos dados

    // Função para formatar a data no formato MM/DD/AAAA
    function formatDate(dateString) {
        if (!dateString) return ''; // Retorna uma string vazia se a data for nula
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    }

    // Popula os dados dos usuários na tabela
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.document}</td>
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td>${user.updatedAt ? formatDate(user.updatedAt) : 'No update'}</td>
            <td>${user.disabledAt ? formatDate(user.disabledAt) : ''}</td>
            <td>
                <button onclick="disableUser(${user.id})">Disable</button>
                <button onclick="redirectToUserEdit(${user.id})">Edit</button>
            </td>
        `;
        userList.appendChild(row);
    });
}

// Function to disable a user
function disableUser(userId) {
    fetch(`http://localhost:8080/api/v1/user/disable`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'dataBase': 'MYSQL',
            'userId': `${userId}`
        }
    })
        .then(response => response.json())
        .then(() => {
            alert('User disabled successfully.');
            findAllUsers(); // Refresh user list after disabling
        })
        .catch(error => console.error('Error disabling user:', error));
}

// Function to redirect to the user edit page
function redirectToUserEdit(userId) {
    window.location.href = `form.html?userId=${userId}`;
}

// Function to redirect to User Creation page
function redirectToUserCreation() {
    window.location.href = 'form.html';
}

// On page load, fetch all users and populate the list
window.onload = findAllUsers;

function searchUsers() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const rows = document.querySelectorAll('#userTable tbody tr');
    
    rows.forEach(row => {
        const name = row.getElementsByTagName('td')[1].innerText.toUpperCase();
        const document = row.getElementsByTagName('td')[2].innerText.toUpperCase();
        
        if (name.indexOf(filter) > -1 || document.indexOf(filter) > -1) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
