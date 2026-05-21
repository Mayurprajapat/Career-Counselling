// Admin Panel JavaScript

const API_BASE = 'http://localhost:3000/api';

// Initialize admin panel with security checks
document.addEventListener('DOMContentLoaded', () => {
    const userStr = localStorage.getItem('careerPathUser');
    const loginTime = localStorage.getItem('careerPathLoginTime');
    const sessionTimeout = 5 * 60 * 1000; // 5 minutes in ms
    
    if (!userStr) {
        alert("Access Denied! Please login as an admin first.");
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(userStr);
    if (!user.isAdmin) {
        alert("Access Denied! You do not have admin privileges.");
        window.location.href = 'index.html';
        return;
    }
    
    if (loginTime && (Date.now() - parseInt(loginTime)) > sessionTimeout) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem('careerPathUser');
        localStorage.removeItem('careerPathLoginTime');
        window.location.href = 'login.html';
        return;
    }
    
    // Update active session timestamp
    localStorage.setItem('careerPathLoginTime', Date.now().toString());

    loadDashboardData();
    setInterval(loadDashboardData, 30000); // Refresh every 30 seconds

    // Fade in body once authentication is successful
    document.body.classList.add('loaded');
});

// Tab switching
function switchTab(tab) {
    // Hide all content
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    
    // Remove active state from all buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('sidebar-active'));
    
    // Show selected tab
    const tabNames = {
        'dashboard': 'Dashboard',
        'database': 'Database Overview',
        'careers': 'Manage Careers',
        'users': 'View Users',
        'analytics': 'Analytics & Reports'
    };
    
    document.getElementById(`${tab}-content`).classList.remove('hidden');
    document.querySelector(`button[onclick="switchTab('${tab}')"]`).classList.add('sidebar-active');
    document.getElementById('page-title').textContent = tabNames[tab];
    
    // Load tab-specific data
    if (tab === 'careers') {
        loadCareers();
    } else if (tab === 'users') {
        loadUsers();
    } else if (tab === 'database') {
        refreshDatabaseStats();
    } else if (tab === 'analytics') {
        loadAnalytics();
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        const [usersRes, careersRes] = await Promise.all([
            fetch(`${API_BASE}/admin/users`),
            fetch(`${API_BASE}/admin/careers`)
        ]);
        
        const usersData = await usersRes.json();
        const careersData = await careersRes.json();
        
        // Update stats
        document.getElementById('total-users').textContent = usersData.count || 0;
        document.getElementById('total-careers').textContent = careersData.count || 0;
        
        // Update timestamp
        const now = new Date();
        document.getElementById('last-updated').textContent = now.toLocaleTimeString();
        
        // Load activities
        loadActivities();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadActivities() {
    try {
        const response = await fetch(`${API_BASE}/admin/activities`);
        const data = await response.json();
        
        const activitiesList = document.getElementById('activities-list');
        
        if (data.activities && data.activities.length > 0) {
            activitiesList.innerHTML = data.activities.map(activity => `
                <div class="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <i class="fas fa-check-circle text-green-500 text-lg mt-1"></i>
                    <div>
                        <p class="text-slate-900 font-medium">${activity.message}</p>
                        <p class="text-slate-500 text-sm">${new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            `).join('');
        } else {
            activitiesList.innerHTML = '<p class="text-slate-500 text-center py-8">No activities yet</p>';
        }
    } catch (error) {
        console.error('Error loading activities:', error);
    }
}

// Careers Management
async function loadCareers() {
    try {
        const response = await fetch(`${API_BASE}/admin/careers`);
        const data = await response.json();
        
        const tbody = document.getElementById('careers-table-body');
        
        if (data.careers && data.careers.length > 0) {
            tbody.innerHTML = data.careers.map(career => `
                <tr>
                    <td class="px-6 py-4 text-slate-900 font-medium">${career.title}</td>
                    <td class="px-6 py-4 text-slate-600">${career.category}</td>
                    <td class="px-6 py-4 text-slate-600 max-w-xs truncate">${career.description}</td>
                    <td class="px-6 py-4">
                        <button onclick="editCareer(${career.id})" class="text-indigo-600 hover:text-indigo-700 mr-3">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteCareer(${career.id})" class="text-red-600 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500">No careers found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading careers:', error);
        document.getElementById('careers-table-body').innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-red-500">Error loading careers</td></tr>';
    }
}

function openAddCareerModal() {
    document.getElementById('career-id').value = '';
    document.getElementById('modal-title').textContent = 'Add Career';
    document.getElementById('career-form').reset();
    document.getElementById('career-modal').classList.add('active');
}

function closeCareerModal() {
    document.getElementById('career-modal').classList.remove('active');
}

async function editCareer(id) {
    try {
        const response = await fetch(`${API_BASE}/admin/careers/${id}`);
        const data = await response.json();
        
        if (data.career) {
            document.getElementById('career-id').value = data.career.id;
            document.getElementById('career-title').value = data.career.title;
            document.getElementById('career-category').value = data.career.category;
            document.getElementById('career-description').value = data.career.description;
            document.getElementById('career-image').value = data.career.image_url || '';
            document.getElementById('modal-title').textContent = 'Edit Career';
            document.getElementById('career-modal').classList.add('active');
        }
    } catch (error) {
        console.error('Error loading career:', error);
        alert('Error loading career details');
    }
}

async function saveCareer(event) {
    event.preventDefault();
    
    const id = document.getElementById('career-id').value;
    const careerData = {
        title: document.getElementById('career-title').value,
        category: document.getElementById('career-category').value,
        description: document.getElementById('career-description').value,
        image_url: document.getElementById('career-image').value
    };
    
    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/admin/careers/${id}` : `${API_BASE}/admin/careers`;
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(careerData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(data.message);
            closeCareerModal();
            loadCareers();
            loadDashboardData();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error saving career:', error);
        alert('Error saving career');
    }
}

async function deleteCareer(id) {
    if (!confirm('Are you sure you want to delete this career?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/admin/careers/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(data.message);
            loadCareers();
            loadDashboardData();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting career:', error);
        alert('Error deleting career');
    }
}

// Users Management
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/admin/users`);
        const data = await response.json();
        
        const tbody = document.getElementById('users-table-body');
        
        if (data.users && data.users.length > 0) {
            tbody.innerHTML = data.users.map(user => `
                <tr>
                    <td class="px-6 py-4 text-slate-900 font-medium">${user.id}</td>
                    <td class="px-6 py-4 text-slate-900 font-medium">${user.email}</td>
                    <td class="px-6 py-4 text-slate-600">${new Date(user.created_at).toLocaleDateString()}</td>
                    <td class="px-6 py-4">
                        <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-700">
                            <i class="fas fa-trash mr-1"></i>Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500">No users found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('users-table-body').innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-red-500">Error loading users</td></tr>';
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/admin/users/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(data.message);
            loadUsers();
            loadDashboardData();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
    }
}

// Database Management
async function refreshDatabaseStats() {
    try {
        const [usersRes, careersRes, mentorsRes] = await Promise.all([
            fetch(`${API_BASE}/admin/users`),
            fetch(`${API_BASE}/admin/careers`),
            fetch(`${API_BASE}/admin/mentors`)
        ]);
        
        const usersData = await usersRes.json();
        const careersData = await careersRes.json();
        const mentorsData = await mentorsRes.json();
        
        document.getElementById('db-users-count').textContent = usersData.count || 0;
        document.getElementById('db-careers-count').textContent = careersData.count || 0;
        document.getElementById('db-mentors-count').textContent = (mentorsData && mentorsData.length) || 0;
        
        const total = (usersData.count || 0) + (careersData.count || 0) + ((mentorsData && mentorsData.length) || 0);
        document.getElementById('db-total-records').textContent = total;
    } catch (error) {
        console.error('Error refreshing database stats:', error);
    }
}

async function viewTableData(tableName) {
    try {
        let response;
        if (tableName === 'users') {
            response = await fetch(`${API_BASE}/admin/users`);
        } else if (tableName === 'careers') {
            response = await fetch(`${API_BASE}/admin/careers`);
        } else if (tableName === 'mentors') {
            response = await fetch(`${API_BASE}/admin/mentors`);
        }
        
        const data = await response.json();
        const viewer = document.getElementById('raw-data-viewer');
        
        if (tableName === 'mentors') {
            const records = data || [];
            viewer.innerHTML = `<pre>${JSON.stringify(records, null, 2)}</pre>`;
        } else {
            const records = data[tableName] || [];
            viewer.innerHTML = `<pre>${JSON.stringify(records, null, 2)}</pre>`;
        }
    } catch (error) {
        console.error('Error viewing table data:', error);
        document.getElementById('raw-data-viewer').innerHTML = `<p class="text-red-500">Error loading data: ${error.message}</p>`;
    }
}

// Analytics
async function loadAnalytics() {
    try {
        // Load user registration timeline
        const usersRes = await fetch(`${API_BASE}/admin/users`);
        const usersData = await usersRes.json();
        
        if (usersData.users) {
            const timelineHtml = usersData.users.map(user => `
                <div class="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded">
                    <i class="fas fa-user-plus text-blue-500 mt-1 text-sm"></i>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-slate-900">${user.email}</p>
                        <p class="text-xs text-slate-500">${new Date(user.created_at).toLocaleString()}</p>
                    </div>
                </div>
            `).join('');
            document.getElementById('registration-timeline').innerHTML = timelineHtml || '<p class="text-slate-500">No registrations yet</p>';
        }
        
        // Load career categories
        const careersRes = await fetch(`${API_BASE}/admin/careers`);
        const careersData = await careersRes.json();
        
        if (careersData.careers) {
            const categories = {};
            careersData.careers.forEach(career => {
                categories[career.category] = (categories[career.category] || 0) + 1;
            });
            
            const categoryHtml = Object.entries(categories).map(([cat, count]) => `
                <div class="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span class="text-sm font-medium text-slate-900">${cat || 'Uncategorized'}</span>
                    <span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">${count}</span>
                </div>
            `).join('');
            document.getElementById('career-categories').innerHTML = categoryHtml || '<p class="text-slate-500">No categories</p>';
        }
        
        // Update activity log
        const activitiesRes = await fetch(`${API_BASE}/admin/activities`);
        const activitiesData = await activitiesRes.json();
        
        if (activitiesData.activities) {
            const activityHtml = activitiesData.activities.map(activity => `
                <div class="flex items-start space-x-3 p-3 bg-slate-50 rounded">
                    <i class="fas fa-check-circle text-green-500 mt-1 text-sm"></i>
                    <div class="flex-1">
                        <p class="text-sm text-slate-900">${activity.message}</p>
                        <p class="text-xs text-slate-500">${new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            `).join('');
            document.getElementById('activity-log').innerHTML = activityHtml;
        }
        
        // Update last sync time
        document.getElementById('last-sync-time').textContent = new Date().toLocaleTimeString();
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('careerPathUser');
        localStorage.removeItem('careerPathLoginTime');
        window.location.href = 'index.html';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('career-modal');
    if (e.target === modal) {
        closeCareerModal();
    }
});
