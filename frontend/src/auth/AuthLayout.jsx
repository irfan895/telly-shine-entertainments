
import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Left Section */}
        <div className="bg-slate-900 text-white p-10 flex flex-col justify-center">

          <Link to="/" className="text-3xl font-bold">
            <span className="text-rose-500">Telly Shine</span>
            <span className="text-white"> Entertainment</span>
          </Link>

          <h1 className="text-4xl font-bold mt-10 leading-tight">
            Your World of Entertainment
          </h1>

          <p className="text-slate-300 mt-4">
            Discover the latest entertainment news, celebrity updates,
            trending stories and exclusive articles.
          </p>

          <p className="text-sm text-slate-400 mt-12">
            © {new Date().getFullYear()} Telly Shine Entertainment
          </p>
        </div>

        {/* Right Section */}
        <div className="p-8 md:p-12 flex flex-col justify-center">

          <h2 className="text-3xl font-bold text-slate-900">
            {title || "Welcome Back"}
          </h2>

          <p className="text-slate-500 mt-2 mb-8">
            {description || "Access your Telly Shine account."}
          </p>

          {children}

        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
