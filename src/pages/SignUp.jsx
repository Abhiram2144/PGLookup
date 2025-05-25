import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const Signup = () => {
  const [role, setRole] = useState("student"); // "student" or "owner"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState({ label: "", color: "" });

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(checkPasswordStrength(pwd));
  };

  const checkPasswordStrength = (password) => {
    const criteria = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const passed = Object.values(criteria).filter(Boolean).length;

    if (passed <= 2) return { label: "Weak", color: "text-red-600" };
    if (passed <= 4) return { label: "Moderate", color: "text-yellow-600" };
    return { label: "Strong", color: "text-green-600" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    console.log(username, email, password);
    const payload = {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      role,
    };

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/user/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }
      toast.success("Successfully signed up!");
      navigate("/login");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

          {/* Role toggle */}
          <div className="flex justify-center mb-4">
            <button
              className={`px-4 py-1 rounded-l ${role === "student" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              onClick={() => setRole("student")}
            >
              Student
            </button>
            <button
              className={`px-4 py-1 rounded-r ${role === "owner" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              onClick={() => setRole("owner")}
            >
              Owner
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-3 p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-1 p-2 border rounded"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <p className={`text-xs mb-2 ${passwordStrength.color}`}>
              Strength: {passwordStrength.label}
            </p>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-3 p-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
