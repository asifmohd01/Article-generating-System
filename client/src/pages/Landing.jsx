import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-gray-800 rounded-xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Healthy Gut AI</h1>
        <p className="text-gray-300 mb-6">
          AI-powered SEO article generation for gut health.
        </p>
        <div className="flex gap-4">
          <Link to="/register" className="px-4 py-2 bg-indigo-600 rounded">
            Get started
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 border border-gray-600 rounded"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
