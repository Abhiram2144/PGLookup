// components/BackButton.jsx
import { useNavigate } from "react-router-dom";

const BackButton = ({ className = "" }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`text-blue-600 hover:underline ${className}`}
    >
      &larr; Back
    </button>
  );
};

export default BackButton;
