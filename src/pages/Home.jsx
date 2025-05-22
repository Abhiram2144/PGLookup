import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-24 px-4 overflow-x-hidden">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-6 text-center">PG Look Up</h1>

        {/* Brief Info Text */}
        <div className="w-full max-w-xl bg-gray-100 p-4 rounded shadow mb-8">
          <p className="text-gray-700 text-center text-lg">
            Struggling to find a PG near your college? PG LookUp makes it easy by connecting students with verified accommodations nearby.
          </p>
        </div>

        <Link to="/pg-list"><button className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition mb-12 text-lg font-medium hover:cursor-pointer">
          Check now
        </button></Link>
        
      </div>
    </>
  );
};

export default Home;
