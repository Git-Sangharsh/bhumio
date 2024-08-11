import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RateChecker.css";
import TickPlacementBars from "./TickPlacementBars";

const RateChecker = () => {
  const [formData, setFormData] = useState({
    price: 200000,
    loan_amount: 180000,
    minfico: 700,
    maxfico: 719,
    state: "AL",
    rate_structure: "fixed",
    loan_term: 30,
    loan_type: "conf",
    arm_type: "5-1",
  });

  const [rateData, setRateData] = useState(null);
  const [error, setError] = useState(null);
  const [percentage, setPercentage] = useState(10);
  const [loanTerm, setLoanTerm] = useState(30);
  const [rateStructure, setRateStructure] = useState("fixed");

  const handleTermChange = (term) => {
    setLoanTerm(term);
    setFormData((prevState) => ({
      ...prevState,
      loan_term: term,
    }));
  };

  const handleRateStructure = (structure) => {
    setRateStructure(structure);
    setFormData((prevState) => ({
      ...prevState,
      rate_structure: structure,
    }));
  };

  const handleLoanTypeChange = (type) => {
    setFormData((prevState) => ({
      ...prevState,
      loan_type: type,
    }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRangeChange = (e) => {
    const value = parseInt(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      minfico: value,
      maxfico: value + 20,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "http://localhost:5000/api/rate-checker",
        {
          params: formData,
        }
      );
      setRateData(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      setRateData(null);
      alert(`Server error: ${err.message}`);
    }
  };

  useEffect(() => {
    const calculateDP = percentage / 100;
    const result = calculateDP * formData.price;
    const updateLoanAmount = formData.price - result;
    console.log("Downpayment amount:", result);
    console.log(formData.price - result);

    setFormData((prevState) => ({
      ...prevState,
      loan_amount: updateLoanAmount,
    }));
  }, [formData.price, percentage]);

  // Sorting rateData from lowest to highest rate
  const sortedRateData = rateData
    ? Object.keys(rateData)
        .sort((a, b) => parseFloat(a) - parseFloat(b))
        .reduce((acc, key) => {
          acc[key] = rateData[key];
          return acc;
        }, {})
    : null;

  return (
    <div className="rate-container">
      {sortedRateData && (
        <div>
          <TickPlacementBars data={sortedRateData} />
        </div>
      )}
      <form className="rate-box" onSubmit={handleSubmit}>
        <div className="div-rate-input">
          <label>Credit Score Range:
          Selected Range: {formData.minfico} - {formData.maxfico}

          </label>
          <input
            type="range"
            min="600"
            max="850"
            step={19}
            value={formData.minfico}
            onChange={handleRangeChange}
            className="dice-range"
          />
        </div>
        <div className="div-rate-input">
          <label>Home Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className="div-rate-input">
          <label>Downpayment Percentage:</label>
          <input
            type="number"
            name="percentage"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          />
        </div>
        <div className="div-rate-input">
          <label>Loan Amount:</label>
          <input
            type="number"
            name="loan_amount"
            value={formData.loan_amount}
            onChange={handleChange}
          />
        </div>
        <div className="div-rate-input">
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        <div className="div-rate-input">
          <label>Rate Type</label>
          <div className="loan-term-div">
            <button
              className={`loan-term-btn ${
                rateStructure === "fixed" ? "active" : "active-disabled"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleRateStructure("fixed");
              }}
            >
              Fixed
            </button>
            <button
              className={`loan-term-btn ${
                rateStructure === "arm" ? "active" : "active-disabled"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleRateStructure("arm");
              }}
            >
              Adjustable
            </button>
          </div>
        </div>
        <div className="div-rate-input">
          <label>Loan Term (years):</label>
          <div className="loan-term-div">
            <button
              className={`loan-term-btn ${loanTerm === 30 ? "active" : "active-disabled"}`}
              onClick={(e) => {
                e.preventDefault();
                handleTermChange(30);
              }}
            >
              30 Years
            </button>
            <button
              className={`loan-term-btn ${loanTerm === 15 ? "active" : "active-disabled"}`}
              onClick={(e) => {
                e.preventDefault();
                handleTermChange(15);
              }}
            >
              15 Years
            </button>
          </div>
        </div>

        <div className="div-rate-input">
          <label>Loan Type:</label>
          <div className="loan-term-div">
            <button
              className={`loan-term-btn ${
                formData.loan_type === "conf" ? "active" : "active-disabled"
              }`}
              onClick={() => handleLoanTypeChange("conf")}
            >
              Conforming
            </button>
            <button
              className={`loan-term-btn ${
                formData.loan_type === "fha" ? "active" : "active-disabled"
              }`}
              onClick={() => handleLoanTypeChange("fha")}
            >
              FHA
            </button>
            <button
              className={`loan-term-btn ${
                formData.loan_type === "va" ? "active" : "active-disabled"
              }`}
              onClick={() => handleLoanTypeChange("va")}
            >
              VA
            </button>
          </div>
        </div>
        <div className="div-rate-input">
          <label>ARM Type (if applicable):</label>
          <select
            name="arm_type"
            value={formData.arm_type}
            onChange={handleChange}
          >
            <option value="5-1">5/1 ARM</option>
            <option value="7-1">7/1 ARM</option>
            <option value="10-1">10/1 ARM</option>
          </select>
          <button className="rate-btn" type="submit">
            Check Rates
          </button>
        </div>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default RateChecker;
