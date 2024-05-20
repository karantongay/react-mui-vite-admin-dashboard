import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


interface FormData {
  date: Date;
  time: Date;
  category: string;
  subCategory: string;
  itemName: string;
  quantity: string;
  totalPrice: string;
  comments: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

const DataEntry: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    date: new Date(),
    time: new Date(),
    category: '',
    subCategory: '',
    itemName: '',
    quantity: '',
    totalPrice: '',
    comments: '',
  });
  const [data, setData] = useState<Post[]>([]);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Replace this with your actual API endpoint and parameters
      const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
        params: {
          date: formData.date.toISOString(),
          time: formData.time.toTimeString().split(' ')[0],
          category: formData.category,
          subCategory: formData.subCategory,
          itemName: formData.itemName,
          quantity: formData.quantity,
          totalPrice: formData.totalPrice,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === 'quantity' && value) {
      setFormData((prevData) => ({ ...prevData, totalPrice: '' }));
    } else if (name === 'totalPrice' && value) {
      setFormData((prevData) => ({ ...prevData, quantity: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation logic
    if (!formData.category || !formData.subCategory || !formData.itemName || !(formData.quantity || formData.totalPrice)) {
      setError('Please fill in all required fields');
    } else {
      setError('');
      console.log('Form submitted:', formData);
      fetchData();
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="data-entry">
      <h2>Data Entry</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Date</label>
          <DatePicker
            selected={formData.date}
            onChange={(date: Date) => setFormData({ ...formData, date })}
            className="date-picker"
          />
        </div>
        <div className="form-group">
          <label>Time</label>
          <DatePicker
            selected={formData.time}
            onChange={(time: Date) => setFormData({ ...formData, time })}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            className="time-picker"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
          </select>
        </div>
        <div className="form-group">
          <label>Sub-Category</label>
          <select name="subCategory" value={formData.subCategory} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
          </select>
        </div>
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            disabled={!!formData.totalPrice}
          />
        </div>
        <div className="form-group">
          <label>Total Price</label>
          <input
            type="text"
            name="totalPrice"
            value={formData.totalPrice}
            onChange={handleInputChange}
            disabled={!!formData.quantity}
          />
        </div>
        <div className="form-group">
          <label>Comments</label>
          <input
            type="text"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Submit</button>
      </form>
      {loading && <div className="spinner"></div>}
      <div className="data-table">
        <h2>Fetched Data</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Body</th>
              <th>Date</th>
              <th>Time</th>
              <th>Category</th>
              <th>Sub-Category</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.body}</td>
                <td>{formData.date.toDateString()}</td>
                <td>{formData.time.toTimeString().split(' ')[0]}</td>
                <td>{formData.category}</td>
                <td>{formData.subCategory}</td>
                <td>{formData.itemName}</td>
                <td>{formData.quantity}</td>
                <td>{formData.totalPrice}</td>
                <td>{formData.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Prev</button>
          <span>{currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default DataEntry;
