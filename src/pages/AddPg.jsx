import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import useUser from "../components/useUser";

const AddPgForm = ({ onPgAdded }) => {
  const { user } = useUser();
  const [collegeOptions, setCollegeOptions] = useState([]);

  const [form, setForm] = useState({
    pgName: "",
    description: "",
    address: "",
    cityName: "",
    rent: "",
    roomsVacant: "",
    contact: "",
    collegeNames: [],
  });

  const [images, setImages] = useState([]);

  const onDrop = (acceptedFiles) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔁 Fetch all existing colleges from backend
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/v1/college/all`);
        // console.log(res.data);

        const formatted = res.data.colleges.map((college) => ({
          value: college.collegeName,
          label: college.collegeName,
        }));

        setCollegeOptions(formatted);
      } catch (err) {
        console.error("Failed to fetch colleges", err);
      }
    };
    fetchColleges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      toast.error("Owner not logged in or user ID missing!");
      return;
    }

    const formData = new FormData();

    Object.entries({
      ...form,
      ownerId: user.id,
    }).forEach(([key, value]) => {
      if (key === "collegeNames") {
        value.forEach((college) => formData.append("collegeNames", college));
      } else {
        formData.append(key, value);
      }
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/v1/pg/new`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200) {
        toast.success("PG added successfully!");
        onPgAdded();
        setForm({
          pgName: "",
          description: "",
          address: "",
          cityName: "",
          rent: "",
          roomsVacant: "",
          contact: "",
          collegeNames: [],
        });
        setImages([]);
      } else {
        toast.error("Failed to add PG");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded shadow"
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold mb-6">Add New PG</h2>

      <Input label="PG Name" name="pgName" value={form.pgName} onChange={handleChange} required />
      <Textarea
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <Input label="Address" name="address" value={form.address} onChange={handleChange} required />
      <Input label="City Name" name="cityName" value={form.cityName} onChange={handleChange} required />
      <Input
        label="Rent Per Month (₹)"
        type="number"
        name="rent"
        value={form.rent}
        onChange={handleChange}
        required
      />
      <Input
        label="Rooms Vacant"
        type="number"
        name="roomsVacant"
        value={form.roomsVacant}
        onChange={handleChange}
        required
      />
      <Input
        label="Contact Number"
        name="contact"
        value={form.contact}
        onChange={handleChange}
        required
      />

      {/* ✅ Dynamic College Dropdown */}
      <div className="mb-4">
        <label className="block font-medium mb-1">College Name</label>
        <CreatableSelect
          options={collegeOptions}
          value={collegeOptions.find((opt) =>
            form.collegeNames.includes(opt.value)
          )}
          onChange={(selected) =>
            setForm((prev) => ({
              ...prev,
              collegeNames: selected ? [selected.value] : [],
            }))
          }
          placeholder="Select or type to add new..."
          isClearable
          filterOption={(option, rawInput) => {
            try {
              const safeInput = (rawInput || "").toString(); // guard against null/undefined
              const escapedInput = safeInput.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              const regex = new RegExp(escapedInput, "i");
              return regex.test(option.label);
            } catch (err) {
              console.warn("Regex filter error:", err);
              return false;
            }
          }}

        />

      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Upload Images</label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed px-6 py-12 rounded cursor-pointer text-center ${isDragActive ? "bg-gray-100" : "bg-gray-50"
            }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop images here...</p>
          ) : (
            <p>Drag & drop or click to select images</p>
          )}
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          {images.map((file, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-full object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs hover:bg-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Submit PG
      </button>
    </form>
  );
};

// Reusable Input Field
const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">{label}</label>
    <input {...props} className="w-full border rounded px-3 py-2" />
  </div>
);

// Reusable Textarea
const Textarea = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">{label}</label>
    <textarea
      {...props}
      className="w-full border rounded px-3 py-2 resize-none h-24"
    />
  </div>
);

export default AddPgForm;
