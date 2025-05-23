import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import BackButton from "../components/BackButton";
import {toast} from 'react-toastify';
const PgDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pg, setPg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    occupation: "",
    homeState: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/pg/pg/${id}`)
      .then((res) => setPg(res.data.pg))
      .catch((err) => console.error("Failed to fetch PG details", err));
  }, [id]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.occupation || !formData.homeState || !formData.phone) {
    alert("Please fill all fields");
    return;
  }

  setLoading(true);

  try {
    await axios.post("http://localhost:8000/api/v1/pg/contact-owner", {
      pgId: pg._id,
      ownerEmail: pg.ownerId.email,  // already fetched from frontend state
      contactDetails: formData,
      pgName: pg.pgName
    });

    toast.success("Message sent successfully!");
    setModalOpen(false);
    setFormData({ name: "", occupation: "", homeState: "", phone: "" });
  } catch (error) {
    console.error("Failed to send message", error);
    alert("Failed to send message. Please try again later.");
  } finally {
    setLoading(false);
  }
};


  if (!pg) return <div className="p-6">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="pt-20 p-6 max-w-5xl mx-auto space-y-6">
        <BackButton className="mb-4" />
        <h1 className="text-4xl font-bold">{pg.pgName}</h1>

        

        <div className="bg-white shadow p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            <p>
              <strong>Address:</strong> {pg.address}
            </p>
            <p>
              <strong>City:</strong> {pg.cityName}
            </p>
            <p>
              <strong>Contact:</strong> {pg.contact}
            </p>
            <p>
              <strong>Rent:</strong> ₹{pg.rent}
            </p>
            <p>
              <strong>Vacant Rooms:</strong> {pg.roomsVacant}
            </p>
            <p>
              <strong>College:</strong>{" "}
              {(pg.collegeIds || []).map((c) => c.name).join(", ")}
            </p>
          </div>
          <div>
            <p className="mt-2">
              <strong>Description:</strong>
            </p>
            <p className="text-gray-700">{pg.description}</p>
          </div>
        </div>

        {/* ... Your existing Swiper galleries and reviews ... */}

        {/* Modal Form */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                aria-label="Close modal"
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-4">Contact Owner</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="occupation"
                  placeholder="Occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="homeState"
                  placeholder="Home State"
                  value={formData.homeState}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  {loading ? "Sending..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        )}
        <button
          onClick={openModal}
          className="mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Contact Owner
        </button>
      </div>
    </>
  );
};

export default PgDetail;
