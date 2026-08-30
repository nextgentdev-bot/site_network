import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase"; // পাথ তোমার ফোল্ডার অনুযায়ী ঠিক করে নিও

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ✅ সফল হলে এখানে redirect করো, যেমন:
      // navigate("/dashboard");
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // ✅ সফল হলে redirect করো
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-2xl shadow-lg shadow-stone-900/5 p-8">
        <h1
          className="text-2xl font-bold text-stone-900 text-center mb-1"
          style={{ fontFamily: "Georgia, serif" }}
        >
          লগইন করুন
        </h1>
        <p className="text-sm text-stone-500 text-center mb-6">
          তোমার অ্যাকাউন্টে প্রবেশ করো
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              ইমেইল
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-amber-500 to-amber-600 shadow-md shadow-amber-500/30 hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-stone-200" />
          <span className="text-xs text-stone-400">অথবা</span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-stone-700 border border-stone-300 hover:bg-stone-50 transition-colors disabled:opacity-60"
        >
          Google দিয়ে লগইন করুন
        </button>

        <p className="text-sm text-stone-500 text-center mt-6">
          অ্যাকাউন্ট নেই?{" "}
          <a href="/register" className="text-emerald-800 font-semibold">
            রেজিস্ট্রেশন করুন
          </a>
        </p>
      </div>
    </div>
  );
};

// Firebase-এর error code গুলোকে মানুষের বোঝার মতো বাংলা মেসেজে রূপান্তর
function mapFirebaseError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "সঠিক ইমেইল দাও।";
    case "auth/user-not-found":
      return "এই ইমেইলে কোনো অ্যাকাউন্ট নেই।";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "ইমেইল অথবা পাসওয়ার্ড ভুল।";
    case "auth/too-many-requests":
      return "অনেকবার চেষ্টা করা হয়েছে, একটু পর আবার চেষ্টা করো।";
    default:
      return "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।";
  }
}

export default Login;