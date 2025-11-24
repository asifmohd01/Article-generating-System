import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("pillar");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !keyword.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Generating your article...");

    try {
      const res = await axios.post("http://localhost:4000/articles/create", {
        title,
        primaryKeyword: keyword,
        articleType: type,
      });
      toast.dismiss(loadingToast);
      toast.success("Article generated successfully!");
      setTimeout(() => nav(`/articles/${res.data.article._id}`), 1000);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        className="p-6 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Create Your SEO Article
        </motion.h2>

        <motion.form
          onSubmit={submit}
          className="bg-slate-800 p-8 rounded-lg shadow-xl space-y-5"
          variants={itemVariants}
        >
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold mb-2 text-slate-300">
              Article Title
            </label>
            <input
              className="w-full p-3 bg-slate-900 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none text-slate-100 transition"
              placeholder="e.g., Benefits of Probiotics for Gut Health"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold mb-2 text-slate-300">
              Primary Keyword
            </label>
            <input
              className="w-full p-3 bg-slate-900 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none text-slate-100 transition"
              placeholder="e.g., probiotics for gut health"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={loading}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold mb-2 text-slate-300">
              Article Type
            </label>
            <select
              className="w-full p-3 bg-slate-900 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none text-slate-100 transition"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={loading}
            >
              <option value="pillar">Pillar Article (2500-3000 words)</option>
              <option value="supporting">
                Supporting Article (1000-1500 words)
              </option>
            </select>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg font-semibold transition-all duration-200 ${
              loading
                ? "bg-slate-600 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/50"
            }`}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            variants={itemVariants}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⚙️
                </motion.div>
                Generating Article...
              </div>
            ) : (
              "✨ Generate Article"
            )}
          </motion.button>
        </motion.form>

        <motion.div
          className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700"
          variants={itemVariants}
        >
          <h3 className="font-semibold text-slate-300 mb-2">💡 Tips:</h3>
          <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
            <li>Pillar articles are comprehensive guides (2500-3000 words)</li>
            <li>Supporting articles are focused pieces (1000-1500 words)</li>
            <li>Use specific keywords for better SEO results</li>
          </ul>
        </motion.div>
      </motion.div>
    </>
  );
}
