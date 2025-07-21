import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AppContext from '../context/AppContext';
import './Profile.css';
import { User, LogOut, ShieldCheck, Edit, Mail, UserSquare } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });

  useEffect(() => {
    if (user?.user) {
      setFormData({
        firstname: user.user.firstname,
        lastname: user.user.lastname,
        email: user.user.email,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const userId = user.user._id || user.user.id;
      const url = `${API_URL}/api/users/${userId}/profile`;
      const response = await axios.patch(url, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      
      const updatedUser = {
        token: user.token,
        user: response.data.user,
      };
      setUser(updatedUser);

      toast.success('Profile updated successfully!');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const userId = user.user._id || user.user.id;
      const url = `${API_URL}/api/users/${userId}/password`;
      await axios.patch(
        url,
        passwordData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success('Password updated successfully!');
      setIsPasswordModalOpen(false);
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password.');
    }
  };

  const handleLogout = () => {
    setUser({ token: null, user: null });
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  if (!user?.user) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  const { firstname, lastname, email } = user.user;

  return (
    <>
      <div className="profile-container">
        <div className="profile-layout">
          <div className="profile-sidebar">
            <div className="avatar-placeholder">
              <span>{firstname?.[0]?.toUpperCase()}{lastname?.[0]?.toUpperCase()}</span>
            </div>
            <h2 className="profile-name">{firstname} {lastname}</h2>
            <p className="profile-role">{user.user.role}</p>
          </div>

          {/* Main Content Section */}
          <div className="profile-main">
            <h3 className="details-header">Account Information</h3>
            <div className="details-grid">        
              <div className="detail-item">
                <label><UserSquare size={16} /> First Name</label>
                <p>{firstname}</p>
              </div>
              <div className="detail-item">
                <label><UserSquare size={16} /> Last Name</label>
                <p>{lastname}</p>
              </div>
              <div className="detail-item full-width">
                <label><Mail size={16} /> Email Address</label>
                <p>{email}</p>
              </div>
            </div>

            <div className="profile-actions">
              <button onClick={() => setIsModalOpen(true)} className="btn-profile btn-update">
                <Edit size={18} /> Update Profile
              </button>
              <button onClick={() => setIsPasswordModalOpen(true)} className="btn-profile btn-password">
                <ShieldCheck size={18} /> Change Password
              </button>
              <button onClick={handleLogout} className="btn-profile btn-logout">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Your Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-close-modal">&times;</button>
            </div>
            <form onSubmit={handleUpdateProfile} className="modal-form">
              <div className="form-group">
                <label htmlFor="firstname">First Name</label>
                <input type="text" id="firstname" name="firstname" value={formData.firstname} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Last Name</label>
                <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="btn-close-modal">&times;</button>
            </div>
            <form onSubmit={handleChangePassword} className="modal-form">
              <div className="form-group">
                <label htmlFor="oldPassword">Current Password</label>
                <input type="password" id="oldPassword" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength={6} />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Change Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
