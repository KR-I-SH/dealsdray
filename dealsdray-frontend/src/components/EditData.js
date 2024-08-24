import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import '../EditData.css'; 
import Layout from './Layout';

const EditData = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check if the user is authenticated
        const isAuthenticated = !!localStorage.getItem('username');
        
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [navigate]);

    const [employee, setEmployee] = useState({
        f_Name: '',
        f_Email: '',
        f_Mobile: '',
        f_Designation: '',
        f_gender: '',
        f_Course: [],
        f_Image: null,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/employees/${id}`);
                setEmployee(response.data);
            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        };

        fetchEmployee();
    }, [id]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!employee.f_Name) {
            newErrors.f_Name = 'Name is required';
            isValid = false;
        }

        if (!employee.f_Email || !/\S+@\S+\.\S+/.test(employee.f_Email)) {
            newErrors.f_Email = 'Valid email is required';
            isValid = false;
        }

        if (!employee.f_Mobile || !/^\d+$/.test(employee.f_Mobile)) {
            newErrors.f_Mobile = 'Valid mobile number is required';
            isValid = false;
        }

        if (!employee.f_Designation) {
            newErrors.f_Designation = 'Designation is required';
            isValid = false;
        }

        if (!employee.f_gender) {
            newErrors.f_gender = 'Gender is required';
            isValid = false;
        }


        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setEmployee(prevState => ({
            ...prevState,
            f_Image: e.target.files[0]
        }));
    };

    const handleCourseChange = (e) => {
        const { value, checked } = e.target;
        setEmployee(prevState => ({
            ...prevState,
            f_Course: checked
                ? [...prevState.f_Course, value]
                : prevState.f_Course.filter(course => course !== value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData();
        for (const key in employee) {
            formData.append(key, employee[key]);
        }

        try {
            await axios.put(`http://localhost:5000/employees/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/fetch-data');
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    return (
        <div className="edit-data-container">
            <Layout/>
            <h2>Edit Employee</h2>
            <form onSubmit={handleSubmit} className="edit-data-form">
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="f_Name"
                        value={employee.f_Name}
                        onChange={handleChange}
                    />
                    {errors.f_Name && <p className="error-message">{errors.f_Name}</p>}
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="text"
                        name="f_Email"
                        value={employee.f_Email}
                        onChange={handleChange}
                    />
                    {errors.f_Email && <p className="error-message">{errors.f_Email}</p>}
                </div>
                <div>
                    <label>Mobile No:</label>
                    <input
                        type="text"
                        name="f_Mobile"
                        value={employee.f_Mobile}
                        onChange={handleChange}
                    />
                    {errors.f_Mobile && <p className="error-message">{errors.f_Mobile}</p>}
                </div>
                <div>
                    <label>Designation:</label>
                    <select
                        name="f_Designation"
                        value={employee.f_Designation}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                    {errors.f_Designation && <p className="error-message">{errors.f_Designation}</p>}
                </div>
                <div>
                    <label>Gender:</label>
                    <input
                        type="radio"
                        name="f_gender"
                        value="M"
                        checked={employee.f_gender === 'M'}
                        onChange={handleChange}
                    /> Male
                    <input
                        type="radio"
                        name="f_gender"
                        value="F"
                        checked={employee.f_gender === 'F'}
                        onChange={handleChange}
                    /> Female
                    {errors.f_gender && <p className="error-message">{errors.f_gender}</p>}
                </div>
                <div>
                    <label>Course:</label>
                    <input
                        type="checkbox"
                        value="MCA"
                        checked={employee.f_Course.includes('MCA')}
                        onChange={handleCourseChange}
                    /> MCA
                    <input
                        type="checkbox"
                        value="BCA"
                        checked={employee.f_Course.includes('BCA')}
                        onChange={handleCourseChange}
                    /> BCA
                    <input
                        type="checkbox"
                        value="BSC"
                        checked={employee.f_Course.includes('BSC')}
                        onChange={handleCourseChange}
                    /> BSC
                </div>
                <div>
                    <label>Image:</label>
                    <img src={`http://localhost:5000/${employee.f_Image}`} alt="employee" width="50" /><br></br>
                    <input
                        type="file"
                        name="f_Image"
                        onChange={handleFileChange}
                    />
                    {errors.f_Image && <p className="error-message">{errors.f_Image}</p>}
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditData;
