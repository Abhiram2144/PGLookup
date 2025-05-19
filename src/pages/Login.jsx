import { useNavigate } from "react-router-dom";
import useUser from "../components/useUser";
import { useState } from "react";

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useUser();
  const navigate = useNavigate();

  const handleDummyLogin = (e) => {
    e.preventDefault();
    login({ id: 1, name: username, role: "owner" }); // Just log in directly
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Login / Signup</h2>
        <form>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) =>
              setUsername(e.target.value)
              }
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) =>
              setPassword(e.target.value)
              }
          />
          <button onClick={handleDummyLogin} className="w-full bg-blue-600 text-white py-2 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
