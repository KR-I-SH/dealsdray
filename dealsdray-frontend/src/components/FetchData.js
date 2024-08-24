import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import '../App.css'; 
import '../FetchData.css';

const ITEMS_PER_PAGE = 4; 

function FetchData() {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortColumn, setSortColumn] = useState('f_Name');
    const [sortOrder, setSortOrder] = useState('asc'); 
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated
        const isAuthenticated = !!localStorage.getItem('username');
        
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:5000/employees');
                setEmployees(response.data);
                setFilteredEmployees(response.data);
                setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        const results = employees.filter(employee =>
            employee.f_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.f_Email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // Sort the results
        results.sort((a, b) => {
            if (sortColumn === 'f_Createdate') {
                return sortOrder === 'asc'
                    ? new Date(a.f_Createdate) - new Date(b.f_Createdate)
                    : new Date(b.f_Createdate) - new Date(a.f_Createdate);
            }
            if (sortOrder === 'asc') {
                return a[sortColumn].localeCompare(b[sortColumn]);
            }
            return b[sortColumn].localeCompare(a[sortColumn]);
        });

        setFilteredEmployees(results);
        setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
    }, [searchQuery, employees, sortColumn, sortOrder]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await axios.delete(`http://localhost:5000/employees/${id}`);
                const updatedEmployees = employees.filter(employee => employee._id !== id);
                setEmployees(updatedEmployees);
                setFilteredEmployees(updatedEmployees);
                setTotalPages(Math.ceil(updatedEmployees.length / ITEMS_PER_PAGE));
                alert('Employee deleted successfully!');
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert('Error deleting employee.');
            }
        }
    };

    // Get the employees for the current page
    const indexOfLastEmployee = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstEmployee = indexOfLastEmployee - ITEMS_PER_PAGE;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSort = (column) => {
        const newSortOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(newSortOrder);
    };

    return (
        <div>
            <Layout />
            <h2>Employee List</h2>
            <div className="fetch-container">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div className="fetch-actions" style={{ marginRight: '20px' }}>
                        <label>Search:</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <div>
                        <p>Total Employees: {filteredEmployees.length}</p>
                    </div>
                </div>
            </div>
            <table className="fetch-table" border="1">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('_id')}>ID</th>
                        <th onClick={() => handleSort('f_Name')}>Name</th>
                        <th onClick={() => handleSort('f_Email')}>Email</th>
                        <th>Mobile No</th>
                        <th onClick={() => handleSort('f_Designation')}>Designation</th>
                        <th>Gender</th>
                        <th>Course</th>
                        <th>Image</th>
                        <th onClick={() => handleSort('f_Createdate')}>Creation Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map(employee => (
                        <tr key={employee._id}>
                            <td>{employee._id}</td>
                            <td>{employee.f_Name}</td>
                            <td>{employee.f_Email}</td>
                            <td>{employee.f_Mobile}</td>
                            <td>{employee.f_Designation}</td>
                            <td>{employee.f_gender}</td>
                            <td>{employee.f_Course.join(', ')}</td>
                            <td><img src={`http://localhost:5000/${employee.f_Image}`} alt="employee" width="50" /></td>
                            <td>{new Date(employee.f_Createdate).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleEdit(employee._id)}>Edit</button>
                                <button onClick={() => handleDelete(employee._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        style={{ margin: '0 5px' }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FetchData;
