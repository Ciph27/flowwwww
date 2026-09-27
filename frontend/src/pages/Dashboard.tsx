import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getStoredUser();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    authService.clearAuth();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'inventory', label: 'Inventory', icon: '📦', subitems: ['Products', 'Categories', 'Stock Levels', 'Stock Movements', 'Stock Counts'] },
    { id: 'stores', label: 'Stores', icon: '🏪', subitems: ['Central Stores', 'Department Stores', 'Store Balances'] },
    { id: 'requisitions', label: 'Requisitions', icon: '📝', subitems: ['New Requisition', 'My Requisitions', 'Pending', 'Approved'] },
    { id: 'purchasing', label: 'Purchasing', icon: '🛒', subitems: ['Purchase Requisitions', 'Purchase Orders', 'Suppliers'] },
    { id: 'receiving', label: 'Receiving', icon: '📥', subitems: ['Goods Received', 'Receive Stock'] },
    { id: 'issues', label: 'Issues', icon: '📤', subitems: ['Issue Stock', 'Issue History'] },
    { id: 'transfers', label: 'Transfers', icon: '🔄', subitems: ['Transfer Stock', 'Transfer History'] },
    { id: 'returns', label: 'Returns', icon: '↩️', subitems: ['Return to Stores', 'Return History'] },
    { id: 'pos', label: 'POS', icon: '💰', subitems: ['Sales', 'Sessions', 'Returns'] },
    { id: 'approvals', label: 'Approvals', icon: '✅', subitems: ['Approval Centre'] },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'accounting', label: 'Accounting', icon: '💼' },
    { id: 'admin', label: 'Administration', icon: '⚙️', subitems: ['Users', 'Roles', 'Departments', 'Stores', 'Settings'] },
    { id: 'audit', label: 'Audit Log', icon: '🔍' },
  ];

  const toolbarButtons = [
    { id: 'new', label: 'New', icon: '📄', shortcut: 'Ctrl+N' },
    { id: 'open', label: 'Open', icon: '📂', shortcut: 'Ctrl+O' },
    { id: 'save', label: 'Save', icon: '💾', shortcut: 'Ctrl+S' },
    { id: 'edit', label: 'Edit', icon: '✏️', shortcut: 'Ctrl+E' },
    { id: 'delete', label: 'Delete', icon: '🗑️', shortcut: 'Del' },
    { id: 'print', label: 'Print', icon: '🖨️', shortcut: 'Ctrl+P' },
    { id: 'search', label: 'Search', icon: '🔎', shortcut: 'Ctrl+F' },
    { id: 'refresh', label: 'Refresh', icon: '🔄', shortcut: 'F5' },
    { id: 'approve', label: 'Approve', icon: '✅' },
    { id: 'reject', label: 'Reject', icon: '❌' },
    { id: 'post', label: 'Post', icon: '📋' },
    { id: 'cancel', label: 'Cancel', icon: '❌', shortcut: 'Esc' },
    { id: 'export', label: 'Export', icon: '📤' },
  ];

  return (
    <div className="business-application">
      {/* Top Menu Bar */}
      <div className="menu-bar">
        <div className="menu-items">
          <span className="menu-item">File</span>
          <span className="menu-item">Edit</span>
          <span className="menu-item">View</span>
          <span className="menu-item">Inventory</span>
          <span className="menu-item">Stores</span>
          <span className="menu-item">Purchasing</span>
          <span className="menu-item">Sales</span>
          <span className="menu-item">Reports</span>
          <span className="menu-item">Accounts</span>
          <span className="menu-item">Administration</span>
          <span className="menu-item">Help</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-buttons">
          {toolbarButtons.map((button) => (
            <button
              key={button.id}
              className="toolbar-button"
              title={`${button.label} (${button.shortcut || ''})`}
            >
              <span className="toolbar-icon">{button.icon}</span>
              <span className="toolbar-label">{button.label}</span>
            </button>
          ))}
        </div>
        <div className="toolbar-search">
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      </div>

      <div className="main-content">
        {/* Sidebar Navigation */}
        <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? '▶' : '◀'}
            </button>
            {!sidebarCollapsed && <span className="sidebar-title">Navigation</span>}
          </div>

          <div className="sidebar-menu">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-group">
                <button
                  className={`menu-button ${activeModule === item.id ? 'active' : ''}`}
                  onClick={() => setActiveModule(item.id)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {!sidebarCollapsed && <span className="menu-label">{item.label}</span>}
                </button>
                {item.subitems && !sidebarCollapsed && (
                  <div className="submenu">
                    {item.subitems.map((subitem) => (
                      <button key={subitem} className="submenu-button">
                        {subitem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Work Area */}
        <div className="work-area">
          {/* Status Bar */}
          <div className="status-bar">
            <div className="status-info">
              <span className="status-item">User: {user?.full_name || 'Guest'}</span>
              <span className="status-separator">|</span>
              <span className="status-item">Role: {user?.role_id || 'Not Assigned'}</span>
              <span className="status-separator">|</span>
              <span className="status-item">Department: {user?.department_id || 'Not Assigned'}</span>
              <span className="status-separator">|</span>
              <span className="status-item">Store: {user?.store_id || 'Not Assigned'}</span>
            </div>
            <div className="status-actions">
              <button onClick={handleLogout} className="status-button">Logout</button>
            </div>
          </div>

          {/* Content Area */}
          <div className="content-area">
            <div className="module-header">
              <h2>{menuItems.find(m => m.id === activeModule)?.label || 'Dashboard'}</h2>
            </div>

            <div className="module-content">
              {activeModule === 'dashboard' && (
                <div className="dashboard-content">
                  <div className="info-panel">
                    <h3>StockFlow Africa - Production Ready</h3>
                    <p>Business & Inventory Management System</p>
                    <div className="system-status">
                      <div className="status-item">
                        <span className="status-label">System Status:</span>
                        <span className="status-value online">Online</span>
                      </div>
                      <div className="status-item">
                        <span className="status-label">Database:</span>
                        <span className="status-value">Supabase PostgreSQL</span>
                      </div>
                      <div className="status-item">
                        <span className="status-label">Environment:</span>
                        <span className="status-value">Production</span>
                      </div>
                    </div>
                  </div>

                  <div className="stats-grid">
                    <div className="stat-panel">
                      <div className="stat-header">System Status</div>
                      <div className="stat-value">Active</div>
                      <div className="stat-label">Authentication System</div>
                    </div>
                    <div className="stat-panel">
                      <div className="stat-header">Implementation</div>
                      <div className="stat-value">Phase 1</div>
                      <div className="stat-label">Complete</div>
                    </div>
                    <div className="stat-panel">
                      <div className="stat-header">Your Role</div>
                      <div className="stat-value">{user?.role_id || 'Not Assigned'}</div>
                      <div className="stat-label">Current Role</div>
                    </div>
                    <div className="stat-panel">
                      <div className="stat-header">Department</div>
                      <div className="stat-value">{user?.department_id || 'Not Assigned'}</div>
                      <div className="stat-label">Assigned Department</div>
                    </div>
                  </div>

                  <div className="implementation-panel">
                    <h3>Implementation Progress</h3>
                    <ul className="progress-list">
                      <li className="completed">✓ Database schema with PostgreSQL</li>
                      <li className="completed">✓ Authentication system with JWT</li>
                      <li className="completed">✓ User management API</li>
                      <li className="completed">✓ Role-based authorization</li>
                      <li className="completed">✓ Department management API</li>
                      <li className="completed">✓ Store management API</li>
                      <li className="completed">✓ Professional business UI</li>
                      <li className="completed">✓ Production configuration</li>
                      <li className="pending">○ Product master (Phase 2)</li>
                      <li className="pending">○ Inventory transaction engine (Phase 2)</li>
                      <li className="pending">○ Requisitions & approval engine (Phase 3)</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;