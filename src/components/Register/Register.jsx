import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase"; // পাথ তোমার ফোল্ডার অনুযায়ী ঠিক করে নিও

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড দুটো মিলছে না।");
      return;
    }
    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে।");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      // ✅ সফল হলে এখানে redirect করো, যেমন:
      // navigate("/dashboard");
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-sm text-stone-500 text-center mb-6">
          নতুন অ্যাকাউন্ট বানিয়ে শুরু করো
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              নাম
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="তোমার নাম"
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700"
            />
          </div>

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
              placeholder="কমপক্ষে ৬ ক্যারেক্টার"
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              পাসওয়ার্ড কনফার্ম করো
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-amber-500 to-amber-600 shadow-md shadow-amber-500/30 hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? "তৈরি হচ্ছে..." : "রেজিস্ট্রেশন করুন"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-stone-200" />
          <span className="text-xs text-stone-400">অথবা</span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>

        <button
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-stone-700 border border-stone-300 hover:bg-stone-50 transition-colors disabled:opacity-60"
        >
          Google দিয়ে রেজিস্ট্রেশন করুন
        </button>

        <p className="text-sm text-stone-500 text-center mt-6">
          অ্যাকাউন্ট আছে?{" "}
          <a href="/login" className="text-emerald-800 font-semibold">
            লগইন করুন
          </a>
        </p>
      </div>
    </div>
  );
};

// Firebase-এর error code গুলোকে মানুষের বোঝার মতো বাংলা মেসেজে রূপান্তর
function mapFirebaseError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "এই ইমেইল দিয়ে আগেই একটা অ্যাকাউন্ট আছে।";
    case "auth/invalid-email":
      return "সঠিক ইমেইল দাও।";
    case "auth/weak-password":
      return "পাসওয়ার্ডটা আরেকটু শক্তিশালী করো।";
    default:
      return "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।";
  }
}

export default Register;