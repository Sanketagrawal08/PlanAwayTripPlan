import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/useTripStore";
import { X } from "lucide-react";
import pahad2 from "../images/pahad2.jpg";

const TripForm = () => {
  const navigate = useNavigate();
  const { generateTrip, loading } = useTripStore();
  const [generateHotelsOption, setGenerateHotelsOption] = useState(false);

  const [formData, setFormData] = React.useState({
    title: "",
    country: "",
    destination: "",
    budget: "",
    travellers: "",
    days: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tripOutline = await generateTrip(formData);
      navigate("/trip-preview", { state: { tripOutline, formData } });
    } catch (err) {
      alert("Failed to generate trip. Please try again.");
      console.error(err);
    }
  };

 return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
     
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${pahad2})` }}
      />
  
      <div className="absolute inset-0 bg-black-75 bg-opacity-50" />

   
      <button
        onClick={() => navigate("/home")}
        className="absolute top-6 right-6 bg-gray-200 hover:bg-gray-300 p-3 rounded-full z-20 shadow-lg"
      >
        <X className="w-6 h-6 text-gray-700" />
      </button>

      {/* Form */}
      <div className="relative z-10 max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Plan Your Dream Trip
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Trip Title"
            required
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            required
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Destination"
            required
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Budget (INR)"
            min={0}
            required
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            name="travellers"
            value={formData.travellers}
            onChange={handleChange}
            placeholder="No. of Travellers "
            min={1}
            max={6}
            required
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            name="days"
            value={formData.days}
            onChange={handleChange}
            min={1}
            max={6}
            placeholder="No. of Days"
            required
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* <div className="flex items-center gap-2">
            <input type="checkbox" id="ch" className="w-5 h-5" checked={generateHotelsOption} onChange={()=>setGenerateHotelsOption(!generateHotelsOption)}/>
            <label htmlFor="ch">Want to Generate Hotel Options</label>
          </div> */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Generating..." : "Generate Trip"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TripForm;
