import { useParams } from "react-router-dom";

const Pg = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-2">PG Details - {id}</h1>
      <p className="text-gray-600">This is where all PG details will be shown.</p>
    </div>
  );
};

export default Pg;
