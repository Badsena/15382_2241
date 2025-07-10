import React, { useState, useEffect } from "react";
import axios from "axios";

const Crud = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // For editing existing users
  const [errors, setErrors] = useState({}); // For form validation errors

  // Roles for the dropdown
  const roles = ["Admin", "User", "Manager"];

  useEffect(() => {
    // Fetch users from API on component mount
    axios
      .get("https://9003.vs.amypo.com/api/usercrud")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching users!", error);
      });
  }, []);

  // Validation function for the form
  const validateForm = () => {
    const newErrors = {};

    // Validate Name
    if (!name) {
      newErrors.name = "Name is required";
    } else if (name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    }

    // Validate Email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate Role
    if (!role) {
      newErrors.role = "Role is required";
    }

    // Validate Image (optional)
    if (image && !image.type.startsWith("image/")) {
      newErrors.image = "Please upload a valid image file";
    }

    if (image && image.size > 5 * 1024 * 1024) {
      newErrors.image = "Image size must be less than 5 MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input field handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    else if (name === "email") setEmail(value);
    else if (name === "role") setRole(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form before submission
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);
    if (image) formData.append("image", image);

    if (editingUser) {
      // Update user if editing
      axios
        .put(`https://9003.vs.amypo.com/api/usercrud/${editingUser.id}`, formData)
        .then(() => {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === editingUser.id
                ? { ...user, name, email, role, image }
                : user
            )
          );
          resetForm();
        })
        .catch((err) => console.log(err));
    } else {
      // Create new user
      axios
        .post("https://9003.vs.amypo.com/api/usercrud", formData)
        .then((response) => {
          setUsers([...users, response.data]);
          resetForm();
        })
        .catch((err) => console.log(err));
    }
  };

  // Reset the form
  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("");
    setImage(null);
    setEditingUser(null);
    setErrors({});
  };

  // Edit user (populate the form with user data)
  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  };

  // Delete user
  const handleDelete = (id) => {
    axios
      .delete(`https://9003.vs.amypo.com/api/usercrud/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <h1 className="title">{editingUser ? "Edit User" : "Add User"}</h1>
      <form onSubmit={handleSubmit} className="user-form" role="form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            className={errors.name ? "input-error" : ""}
            type="text"
            name="name"
            value={name}
            onChange={handleInputChange}
            required
            placeholder="Enter name"
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className={errors.email ? "input-error" : ""}
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
            placeholder="Enter email"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            className={errors.role ? "input-error" : ""}
            name="role"
            value={role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            {roles.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
          {errors.role && <p className="error-text">{errors.role}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input id="image" type="file" onChange={handleImageChange} />
          {errors.image && <p className="error-text">{errors.image}</p>}
          {image && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                height="100"
                width="100"
              />
            </div>
          )}
        </div>
        <button type="submit" className="btn-submit">
          {editingUser ? "Update User" : "Add User"}
        </button>
        {editingUser && (
          <button type="button" className="btn-cancel" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h2 className="user-list-title">User List</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-card">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="user-image"
                height="80"
                width="80"
              />
            ) : (
              <div className="user-image-placeholder">No Image</div>
            )}
            <div className="user-info">
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
              <p className="user-role">{user.role}</p>
            </div>
            <div className="user-actions">
              <button className="btn-edit" onClick={() => handleEdit(user)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
          background: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .title {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }
        .user-form {
          background: #fff;
          padding: 20px;
          border-radius: 6px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
          margin-bottom: 30px;
        }
        .form-group {
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 6px;
          font-weight: bold;
          color: #555;
        }
        input[type="text"],
        input[type="email"],
        select,
        input[type="file"] {
          padding: 8px 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }
        input[type="text"]:focus,
        input[type="email"]:focus,
        select:focus {
          border-color: #007bff;
          outline: none;
        }
        .input-error {
          border-color: #dc3545;
        }
        .error-text {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
        }
        .image-preview {
          margin-top: 10px;
        }
        .btn-submit,
        .btn-cancel {
          padding: 10px 20px;
          font-size: 14px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 10px;
          transition: background-color 0.3s ease;
        }
        .btn-submit {
          background-color: #007bff;
          color: white;
        }
        .btn-submit:hover {
          background-color: #0056b3;
        }
        .btn-cancel {
          background-color: #6c757d;
          color: white;
        }
        .btn-cancel:hover {
          background-color: #5a6268;
        }
        .user-list-title {
          color: #333;
          margin-bottom: 15px;
          border-bottom: 2px solid #007bff;
          padding-bottom: 5px;
        }
        .user-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }
        .user-card {
          background: white;
          border-radius: 6px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: box-shadow 0.3s ease;
        }
        .user-card:hover {
          box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
        }
        .user-image {
          border-radius: 50%;
          object-fit: cover;
        }
        .user-image-placeholder {
          width: 80px;
          height: 80px;
          background-color: #ddd;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 12px;
        }
        .user-info {
          flex-grow: 1;
        }
        .user-name {
          font-weight: bold;
          font-size: 16px;
          margin: 0 0 5px 0;
          color: #007bff;
        }
        .user-email,
        .user-role {
          margin: 0;
          font-size: 14px;
          color: #555;
        }
        .user-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .btn-edit,
        .btn-delete {
          padding: 6px 12px;
          font-size: 14px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          color: white;
          transition: background-color 0.3s ease;
        }
        .btn-edit {
          background-color: #28a745;
        }
        .btn-edit:hover {
          background-color: #218838;
        }
        .btn-delete {
          background-color: #dc3545;
        }
        .btn-delete:hover {
          background-color: #c82333;
        }
        @media (max-width: 600px) {
          .user-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .user-actions {
            flex-direction: row;
            gap: 10px;
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Crud;
