import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const PgList = () => {
  const [pgs, setPgs] = useState([]);
  const [filteredPgs, setFilteredPgs] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pgsPerPage = 5;

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/pg/all")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.pgs)) {
          setPgs(data.pgs);
          setFilteredPgs(data.pgs);
        } else {
          console.error("Unexpected API format:", data);
        }
      })
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  const collegeOptions = [...new Set((pgs || []).flatMap(pg => pg.collegeNames || []))];

  const handleCollegeFilter = (college) => {
    setSelectedCollege(college);
    setCurrentPage(1);
    setFilteredPgs(
      college ? pgs.filter(pg => pg.collegeNames?.includes(college)) : pgs
    );
  };

  const paginatedPgs = filteredPgs.slice((currentPage - 1) * pgsPerPage, currentPage * pgsPerPage);
  const totalPages = Math.ceil(filteredPgs.length / pgsPerPage) || 1;

  return (
    <>
      <Navbar />
      <div className="pt-24 p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4 relative z-50">
          <h2 className="text-2xl font-bold">List of PGs</h2>
          <select
            value={selectedCollege}
            onChange={(e) => handleCollegeFilter(e.target.value)}
            className="border p-2 rounded bg-white shadow relative z-50"
          >
            <option value="">All Colleges</option>
            {collegeOptions.map((college, index) => (
              <option key={index} value={college}>{college}</option>
            ))}
          </select>
        </div>

        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">PG Name</th>
              <th className="p-2">Location</th>
              <th className="p-2">College</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPgs.map((pg, index) => (
              <tr key={pg._id} className="border-t">
                <td className="p-2">{(currentPage - 1) * pgsPerPage + index + 1}</td>
                <td className="p-2">{pg.pgName}</td>
                <td className="p-2">{pg.cityName}</td>
                <td className="p-2">{(pg.collegeNames || []).join(", ")}</td>
                <td className="p-2">
                  <Link to={`/pg/${pg._id}`} className="text-blue-600 hover:underline">More Info</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            &larr; Prev
          </button>

          <span>Page {currentPage} of {totalPages}</span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </>
  );
};

export default PgList;
