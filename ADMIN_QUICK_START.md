# Admin Panel Quick Start Guide

## Installation & Setup

### 1. Ensure Dependencies are Installed
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

You should see:
```
Connected to SQLite database.
Server running on http://localhost:3000
```

### 3. Access Admin Panel
Open your browser and navigate to:
```
http://localhost:3000/admin
```

## Main Dashboard
- **Total Users**: Shows count of registered users
- **Total Careers**: Shows count of career listings
- **Last Updated**: Shows the time of last dashboard refresh
- **Recent Activities**: Shows system activities

## Managing Careers

### View All Careers
1. Click "Manage Careers" in the sidebar
2. All careers are displayed in a table

### Add New Career
1. Click "Manage Careers"
2. Click "Add Career" button
3. Enter:
   - Title (e.g., "Data Science")
   - Category (e.g., "technology")
   - Description
   - Image URL (optional)
4. Click "Save Career"

### Edit Career
1. Click the edit icon (✏️) next to a career
2. Update the fields
3. Click "Save Career"

### Delete Career
1. Click the delete icon (🗑️) next to a career
2. Confirm deletion

## Managing Users

### View Users
1. Click "View Users" in the sidebar
2. See all registered users with:
   - Email address
   - Join date
   - Delete option

### Delete User
1. Click "View Users"
2. Click the delete button next to a user
3. Confirm deletion

## UI Elements

### Sidebar
- **Dashboard**: Main admin dashboard
- **Manage Careers**: Career management
- **View Users**: User management
- **Logout**: Exit admin panel

### Colors & Icons
- **Indigo** (#4f46e5): Primary color for active/interactive elements
- **Blue**: User statistics
- **Green**: Career statistics
- **Purple**: Time/clock elements

## Tips

✅ **Best Practices**:
- Provide clear career descriptions
- Use proper image URLs
- Organize careers by category
- Review users regularly
- Monitor recent activities

⚠️ **Important Notes**:
- No password/authentication currently
- Add production security before deploying
- Data is stored in SQLite database (careerpath.db)
- All changes are immediate

## Keyboard Shortcuts
- `Esc` - Close modal (add/edit career form)

## Support

For issues or questions, check:
1. Browser Console (F12) for errors
2. Server logs in terminal
3. ADMIN_PANEL_README.md for detailed documentation

---
**Version**: 1.0.0  
**Last Updated**: May 2026
