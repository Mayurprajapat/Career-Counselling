# Admin Panel - CareerPath

## Overview
A complete admin panel for managing careers and users in the CareerPath application.

## Features

### 1. Dashboard
- View total number of registered users
- View total number of career listings
- See last update timestamp
- View recent system activities

### 2. Manage Careers
- **View all careers** - See all career listings in a table format
- **Add Career** - Create new career entries with:
  - Career Title
  - Category
  - Description
  - Image URL
- **Edit Career** - Modify existing career information
- **Delete Career** - Remove careers from the database

### 3. View Users
- **View all registered users** - See email and join date
- **Delete User** - Remove user accounts

## How to Access

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Access the admin panel:**
   - Open your browser and go to: `http://localhost:3000/admin`

## API Endpoints

All admin API endpoints are prefixed with `/api/admin/`

### Users
- `GET /api/admin/users` - Get user count and list
- `DELETE /api/admin/users/:id` - Delete a user

### Careers
- `GET /api/admin/careers` - Get all careers
- `GET /api/admin/careers/:id` - Get specific career
- `POST /api/admin/careers` - Create new career
- `PUT /api/admin/careers/:id` - Update career
- `DELETE /api/admin/careers/:id` - Delete career

### Activities
- `GET /api/admin/activities` - Get system activities

## Career Management

### Adding a Career
1. Click "Manage Careers" in the sidebar
2. Click "Add Career" button
3. Fill in the form:
   - **Title**: Career name (e.g., "Software Engineer")
   - **Category**: Category type (e.g., "technology", "science", "creative")
   - **Description**: Detailed description of the career
   - **Image URL**: Optional image URL for the career
4. Click "Save Career"

### Editing a Career
1. Go to "Manage Careers"
2. Click the edit icon (pencil) next to a career
3. Modify the fields as needed
4. Click "Save Career"

### Deleting a Career
1. Go to "Manage Careers"
2. Click the delete icon (trash) next to a career
3. Confirm the deletion

## File Structure

- `admin.html` - Admin panel interface (HTML)
- `admin.js` - Admin panel functionality (Frontend JavaScript)
- `admin-api.js` - Admin API routes (Backend - integrated into server.js)
- `server.js` - Backend server (Express.js with SQLite)

## Styling

The admin panel uses:
- **Tailwind CSS** for responsive design
- **Font Awesome icons** for UI elements
- Custom dark-themed interface with indigo accent color

## Security Notes

⚠️ **Important**: This admin panel currently has no authentication. For production:
1. Add user authentication/login
2. Implement authorization checks
3. Add password hashing
4. Use secure sessions/tokens
5. Validate all inputs server-side

## Troubleshooting

**Admin panel not loading?**
- Ensure server is running on port 3000
- Check browser console for errors
- Verify CORS is enabled

**API calls failing?**
- Check that server.js is running
- Verify the API endpoint URLs in admin.js
- Check server.js console for errors

**Modal not appearing?**
- Check browser console for JavaScript errors
- Verify CSS is loading correctly
- Try refreshing the page

## Future Enhancements

- [ ] Add authentication/login system
- [ ] Add user activity logs
- [ ] Add mentor management
- [ ] Add export/import functionality
- [ ] Add career analytics
- [ ] Add bulk operations
- [ ] Add search and filter functionality
