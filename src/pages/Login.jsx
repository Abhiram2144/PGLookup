import { useNavigate } from "react-router-dom";
import useUser from "../components/useUser";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [oid, setOid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login , user} = useUser();
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  const payload = {
    email: username.trim(),
    password: password.trim(),
    isOwner: isOwner,   // <-- send this explicitly
  };

  if (isOwner) {
    payload.oid = oid.trim();
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/v1/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("data: ",data);
    
    if (!res.ok) {
      setError(data.message || "Login failed");
      setLoading(false);
      return;
    }

    login({
      id: data.id,
      name: data.name,
      role: data.role,
      token: data.token,
    });
    toast.success("Successfully logged in!");
    console.log("user: ",user);
    
    setTimeout(() => {
      navigate("/");
    }, 500); 
  } catch (err) {
    console.error(err);
    setError("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div >
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex items-center mb-3">
              <input
                id="ownerCheck"
                type="checkbox"
                checked={isOwner}
                onChange={(e) => setIsOwner(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="ownerCheck" className="text-sm">
                Are you an owner?
              </label>
            </div>
            {isOwner && (
              <input
                type="text"
                placeholder="Enter OID"
                className="w-full mb-3 p-2 border rounded"
                value={oid}
                onChange={(e) => setOid(e.target.value)}
                required
              />
            )}


            {error && <p className="text-red-600 mb-2">{error}</p>}
            <p className="mt-4 text-sm text-center pb-4">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Create one
              </span>
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Logging in..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
