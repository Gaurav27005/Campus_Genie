import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();
  
  // Stats for dashboard
  const [stats, setStats] = useState({
    users: 0,
    lostItems: 0,
    marketplaceItems: 0,
    materials: 0
  });

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    const isAdmin = localStorage.getItem('isAdmin');
    
    if (!adminToken || isAdmin !== 'true') {
      navigate('/admin/login');
      return;
    }
    
    // Fetch stats (mock data for now)
    setStats({
      users: 120,
      lostItems: 45,
      marketplaceItems: 78,
      materials: 32
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <img src="/assets/noto_man-genie.png" alt="Campus Genie" />
          <h2>Admin Panel</h2>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={activeSection === 'overview' ? 'active' : ''} 
            onClick={() => setActiveSection('overview')}
          >
            Overview
          </button>
          <button 
            className={activeSection === 'lostfound' ? 'active' : ''} 
            onClick={() => setActiveSection('lostfound')}
          >
            Lost & Found
          </button>
          <button 
            className={activeSection === 'marketplace' ? 'active' : ''} 
            onClick={() => setActiveSection('marketplace')}
          >
            Marketplace
          </button>
          <button 
            className={activeSection === 'materials' ? 'active' : ''} 
            onClick={() => setActiveSection('materials')}
          >
            Study Materials
          </button>
          <button 
            className={activeSection === 'users' ? 'active' : ''} 
            onClick={() => setActiveSection('users')}
          >
            Users
          </button>
        </nav>
        
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>
            {activeSection === 'overview' && 'Dashboard Overview'}
            {activeSection === 'lostfound' && 'Lost & Found Management'}
            {activeSection === 'marketplace' && 'Marketplace Management'}
            {activeSection === 'materials' && 'Study Materials Management'}
            {activeSection === 'users' && 'User Management'}
          </h1>
          <div className="admin-user">
            <span>Developer</span>
          </div>
        </div>
        
        {activeSection === 'overview' && (
          <div className="admin-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Users</h3>
                <p className="stat-number">{stats.users}</p>
                <Link to="/admin/users" className="stat-link">Manage Users</Link>
              </div>
              <div className="stat-card">
                <h3>Lost & Found Items</h3>
                <p className="stat-number">{stats.lostItems}</p>
                <Link to="/admin/lostfound" className="stat-link">Manage Items</Link>
              </div>
              <div className="stat-card">
                <h3>Marketplace Listings</h3>
                <p className="stat-number">{stats.marketplaceItems}</p>
                <Link to="/admin/marketplace" className="stat-link">Manage Listings</Link>
              </div>
              <div className="stat-card">
                <h3>Study Materials</h3>
                <p className="stat-number">{stats.materials}</p>
                <Link to="/admin/materials" className="stat-link">Manage Materials</Link>
              </div>
            </div>
            
            <div className="admin-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={() => setActiveSection('lostfound')}>Moderate Lost & Found</button>
                <button onClick={() => setActiveSection('marketplace')}>Review Marketplace</button>
                <button onClick={() => setActiveSection('materials')}>Approve Materials</button>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'lostfound' && <AdminLostFound />}
        {activeSection === 'marketplace' && <AdminMarketplace />}
        {activeSection === 'materials' && <AdminMaterials />}
        {activeSection === 'users' && <AdminUsers />}
      </div>
    </div>
  );
};

// Admin Lost & Found Component
const AdminLostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch lost & found items (mock data for now)
    setTimeout(() => {
      setItems([
        { id: 1, title: 'Lost Keys', status: 'lost', location: 'Library', date: '2023-04-15', contact: 'john@example.com' },
        { id: 2, title: 'Found Wallet', status: 'found', location: 'Cafeteria', date: '2023-04-10', contact: 'jane@example.com' },
        { id: 3, title: 'Lost Laptop', status: 'lost', location: 'Lecture Hall', date: '2023-04-05', contact: 'mike@example.com' }
      ]);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleEdit = (id) => {
    // In a real app, this would open an edit form
    alert(`Edit item ${id}`);
  };
  
  return (
    <div className="admin-section">
      <div className="admin-controls">
        <button className="add-btn">Add New Item</button>
        <input type="text" placeholder="Search items..." className="admin-search" />
      </div>
      
      {loading ? (
        <p>Loading items...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Location</th>
              <th>Date</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.location}</td>
                <td>{item.date}</td>
                <td>{item.contact}</td>
                <td className="action-buttons">
                  <button onClick={() => handleEdit(item.id)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Admin Marketplace Component
const AdminMarketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch marketplace items (mock data for now)
    setTimeout(() => {
      setItems([
        { id: 1, title: 'Calculus Textbook', price: '₹800', category: 'Books', seller: 'John Doe', date: '2023-04-15' },
        { id: 2, title: 'Scientific Calculator', price: '₹1,200', category: 'Electronics', seller: 'Jane Smith', date: '2023-04-10' },
        { id: 3, title: 'Desk Lamp', price: '₹500', category: 'Furniture', seller: 'Mike Johnson', date: '2023-04-05' }
      ]);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleEdit = (id) => {
    // In a real app, this would open an edit form
    alert(`Edit item ${id}`);
  };
  
  return (
    <div className="admin-section">
      <div className="admin-controls">
        <button className="add-btn">Add New Listing</button>
        <input type="text" placeholder="Search listings..." className="admin-search" />
      </div>
      
      {loading ? (
        <p>Loading items...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Seller</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.price}</td>
                <td>{item.category}</td>
                <td>{item.seller}</td>
                <td>{item.date}</td>
                <td className="action-buttons">
                  <button onClick={() => handleEdit(item.id)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Admin Materials Component
const AdminMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch materials (mock data for now)
    setTimeout(() => {
      setMaterials([
        { id: 1, title: 'Engineering Mathematics', subject: 'Mathematics', uploadedBy: 'John Doe', date: '2023-04-15', downloads: 45 },
        { id: 2, title: 'Data Structures', subject: 'Computer Science', uploadedBy: 'Jane Smith', date: '2023-04-10', downloads: 78 },
        { id: 3, title: 'Computer Networks', subject: 'Computer Science', uploadedBy: 'Mike Johnson', date: '2023-04-05', downloads: 32 }
      ]);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleDelete = (id) => {
    setMaterials(materials.filter(material => material.id !== id));
  };
  
  const handleEdit = (id) => {
    // In a real app, this would open an edit form
    alert(`Edit material ${id}`);
  };
  
  return (
    <div className="admin-section">
      <div className="admin-controls">
        <button className="add-btn">Add New Material</button>
        <input type="text" placeholder="Search materials..." className="admin-search" />
      </div>
      
      {loading ? (
        <p>Loading materials...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Subject</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th>Downloads</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map(material => (
              <tr key={material.id}>
                <td>{material.id}</td>
                <td>{material.title}</td>
                <td>{material.subject}</td>
                <td>{material.uploadedBy}</td>
                <td>{material.date}</td>
                <td>{material.downloads}</td>
                <td className="action-buttons">
                  <button onClick={() => handleEdit(material.id)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(material.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Admin Users Component
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch users (mock data for now)
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', joinDate: '2023-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student', joinDate: '2023-02-10' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Student', joinDate: '2023-03-05' }
      ]);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };
  
  const handleEdit = (id) => {
    // In a real app, this would open an edit form
    alert(`Edit user ${id}`);
  };
  
  return (
    <div className="admin-section">
      <div className="admin-controls">
        <button className="add-btn">Add New User</button>
        <input type="text" placeholder="Search users..." className="admin-search" />
      </div>
      
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.joinDate}</td>
                <td className="action-buttons">
                  <button onClick={() => handleEdit(user.id)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;