import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../context/AuthContext";

// Loading skeleton component
const SkeletonCard = () => (
  <motion.div className="bg-slate-800 p-6 rounded-lg">
    <motion.div
      className="h-6 bg-slate-700 rounded w-3/4 mb-3"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.div
      className="h-4 bg-slate-700 rounded w-1/2 mb-4"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div
      className="h-8 bg-slate-700 rounded w-1/4"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
    />
  </motion.div>
);

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/articles");
      setArticles(res.data.articles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="flex justify-between items-center mb-8"
        variants={itemVariants}
      >
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-slate-400 mt-2">
            Welcome back, {user?.name || "User"}!
          </p>
        </div>
        <Link
          to="/articles/create"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-200 transform hover:scale-105"
        >
          ✨ Create Article
        </Link>
      </motion.div>

      <div>
        {loading ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {articles.map((a, idx) => (
              <motion.div
                key={a._id}
                className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {a.title}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-indigo-600/30 text-indigo-300 rounded">
                    {a.articleType === "pillar" ? "📋 Pillar" : "📝 Supporting"}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  <strong>Keyword:</strong> {a.primaryKeyword}
                </p>
                <div className="text-xs text-slate-500 mb-4">
                  Created: {new Date(a.createdAt).toLocaleDateString()}
                </div>
                <motion.div className="flex gap-3" whileHover={{ x: 5 }}>
                  <Link
                    to={`/articles/${a._id}`}
                    className="flex-1 text-center px-3 py-2 bg-indigo-600 text-indigo-50 rounded transition-all hover:bg-indigo-500"
                  >
                    👁️ View
                  </Link>
                  <motion.button
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `http://localhost:4000/articles/${a._id}`
                        );
                        load();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="px-3 py-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🗑️
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
            {articles.length === 0 && !loading && (
              <motion.div
                className="col-span-full text-center py-12 text-slate-400"
                variants={itemVariants}
              >
                <p className="text-lg">📭 No articles yet</p>
                <Link
                  to="/articles/create"
                  className="text-indigo-400 hover:text-indigo-300 mt-3 inline-block"
                >
                  Create your first article →
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
