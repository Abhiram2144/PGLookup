// src/pages/PgDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const PgDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pg, setPg] = useState(null);

 useEffect(() => {
  axios.get(`http://localhost:8000/api/v1/pg/pg/${id}`)
    .then(res => {
      setPg(res.data.pg);
    })
    .catch(err => {
      console.error("Failed to fetch PG details", err);
    });
}, [id]);

  if (!pg) return <div className="p-6">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4">&larr; Back</button>
        <h1 className="text-3xl font-bold mb-2">{pg.pgName}</h1>
        <div className="bg-gray-100 p-6 rounded">
          <p className="mb-2"><strong>Address:</strong> {pg.address}</p>
          <p className="mb-2"><strong>City:</strong> {pg.cityName}</p>
          <p className="mb-2"><strong>Contact:</strong> {pg.contact}</p>
          <p className="mb-2"><strong>Rent:</strong> ₹{pg.rent}</p>
          <p className="mb-2"><strong>Vacant Rooms:</strong> {pg.roomsVacant}</p>
          <p className="mb-2"><strong>College:</strong> {(pg.collegeIds || []).map(c => c.name).join(", ")}</p>

          <p className="mb-2"><strong>Description:</strong> {pg.description}</p>
          {pg.images && pg.images.length > 0 && (
            <img
              src={pg.images[0]}
              alt="PG"
              className="mt-4 w-48 h-32 object-cover rounded"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PgDetail;