import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';
import '../App.css'; 
import '../InsertData.css';
import { useNavigate } from 'react-router-dom';

function InsertData() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated
        const isAuthenticated = !!localStorage.getItem('username');
        
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        f_Name: '',
        f_Email: '',
        f_Mobile: '',
        f_Designation: 'HR',
        f_gender: 'M',
        f_Course: [],
        f_Image: null,
    });

    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (checked) {
                setFormData(prevState => ({
                    ...prevState,
                    f_Course: [...prevState.f_Course, value]
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    f_Course: prevState.f_Course.filter(course => course !== value)
                }));
            }
        } else if (type === 'file') {
            if (e.target.files[0] && !['image/jpeg', 'image/png'].includes(e.target.files[0].type)) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    f_Image: 'Only JPG/PNG files are allowed'
                }));
                setFormData({
                    ...formData,
                    f_Image: null
                });
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    f_Image: null
                }));
                setFormData({
                    ...formData,
                    f_Image: e.target.files[0]
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const validateForm = () => {
        let valid = true;
        let errors = {};

        if (!formData.f_Name) {
            errors.f_Name = 'Name is required';
            valid = false;
        }
        if (!formData.f_Email) {
            errors.f_Email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.f_Email)) {
            errors.f_Email = 'Email is invalid';
            valid = false;
        }
        if (!formData.f_Mobile) {
            errors.f_Mobile = 'Mobile No is required';
            valid = false;
        } else if (!/^\d{10}$/.test(formData.f_Mobile)) {
            errors.f_Mobile = 'Mobile No must be numeric or must be exactly 10 digits';
            valid = false;
        }
        if (!formData.f_Image) {
            errors.f_Image = 'Image is required';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = new FormData();
        data.append('f_Name', formData.f_Name);
        data.append('f_Email', formData.f_Email);
        data.append('f_Mobile', formData.f_Mobile);
        data.append('f_Designation', formData.f_Designation);
        data.append('f_gender', formData.f_gender);
        data.append('f_Course', formData.f_Course.join(','));
        data.append('f_Image', formData.f_Image);

        try {
            const response = await axios.post('http://localhost:5000/employees', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            alert('Employee inserted successfully!');
            setFormData({
                f_Name: '',
                f_Email: '',
                f_Mobile: '',
                f_Designation: 'HR',
                f_gender: 'M',
                f_Course: [],
                f_Image: null,
            });
        } catch (error) {
            console.error('Error inserting employee:', error);
            alert('Error inserting employee.');
        }
    };

    return (
        <div className="insert-container">
            <Layout/>
            <h2>Insert Employee</h2>
            <form className="insert-form" onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="f_Name"
                        value={formData.f_Name}
                        onChange={handleChange}
                        required
                    />
                    {errors.f_Name && <span style={{ color: 'red' }}>{errors.f_Name}</span>}
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="f_Email"
                        value={formData.f_Email}
                        onChange={handleChange}
                        required
                    />
                    {errors.f_Email && <span style={{ color: 'red' }}>{errors.f_Email}</span>}
                </div>

                <div>
                    <label>Mobile No:</label>
                    <input
                        type="text"
                        name="f_Mobile"
                        value={formData.f_Mobile}
                        onChange={handleChange}
                        required
                    />
                    {errors.f_Mobile && <span style={{ color: 'red' }}>{errors.f_Mobile}</span>}
                </div>

                <div>
                    <label>Designation:</label>
                    <select
                        name="f_Designation"
                        value={formData.f_Designation}
                        onChange={handleChange}
                    >
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>

                <div>
                    <label>Gender:</label>
                    <input
                        type="radio"
                        name="f_gender"
                        value="M"
                        checked={formData.f_gender === 'M'}
                        onChange={handleChange}
                    /> Male
                    <input
                        type="radio"
                        name="f_gender"
                        value="F"
                        checked={formData.f_gender === 'F'}
                        onChange={handleChange}
                    /> Female
                </div>

                <div>
                    <label>Course:</label>
                    <input
                        type="checkbox"
                        name="f_Course"
                        value="MCA"
                        checked={formData.f_Course.includes('MCA')}
                        onChange={handleChange}
                    /> MCA
                    <input
                        type="checkbox"
                        name="f_Course"
                        value="BCA"
                        checked={formData.f_Course.includes('BCA')}
                        onChange={handleChange}
                    /> BCA
                    <input
                        type="checkbox"
                        name="f_Course"
                        value="BSC"
                        checked={formData.f_Course.includes('BSC')}
                        onChange={handleChange}
                    /> BSC
                </div>

                <div>
                    <label>Image Upload:</label>
                    <input
                        type="file"
                        name="f_Image"
                        accept="image/png, image/jpeg"
                        onChange={handleChange}
                    />
                    {errors.f_Image && <span style={{ color: 'red' }}>{errors.f_Image}</span>}
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default InsertData;