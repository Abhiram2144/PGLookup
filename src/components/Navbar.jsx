import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-100 border-b border-gray-300 shadow-sm py-4 px-6 flex justify-between items-center z-40">
      <Link to="/" className="text-2xl font-bold text-gray-800">
        PGLookUp
      </Link>
      <div className="space-x-4">
        <Link
          to="/pgs"
          className="bg-white text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-200 transition"
        >
          Look PGs
        </Link>
        <Link
          to="/login"
          className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-white hover:text-gray-800 transition"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
