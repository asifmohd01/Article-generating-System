import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ViewArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/articles/${id}`);
      setArticle(res.data.article);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load article");
    } finally {
      setLoading(false);
    }
  };

  const copyJson = () => {
    const jsonStr = JSON.stringify(article.jsonLd, null, 2);
    navigator.clipboard.writeText(jsonStr);
    toast.success("JSON-LD copied to clipboard!");
  };

  const downloadPDF = async () => {
    setExporting(true);
    try {
      const element = document.getElementById("article-content");
      if (!element) {
        toast.error("Content not found");
        return;
      }

      toast.loading("Generating PDF...");
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#1e293b",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add title and metadata
      pdf.setFontSize(16);
      pdf.text(article.title, 10, 10);
      pdf.setFontSize(10);
      pdf.text(`Keyword: ${article.primaryKeyword}`, 10, 20);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 10, 27);

      // Add content image
      pdf.addImage(imgData, "PNG", 0, 35, pdfWidth, pdfHeight);
      pdf.save(`${article.slug || "article"}.pdf`);
      toast.dismiss();
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        className="p-6 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="space-y-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="h-8 bg-slate-700 rounded w-3/4" />
          <div className="h-6 bg-slate-700 rounded w-1/2" />
          <div className="h-64 bg-slate-700 rounded" />
        </motion.div>
      </motion.div>
    );
  }

  if (!article) {
    return (
      <motion.div
        className="p-6 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-2xl text-slate-400">📭 Article not found</p>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        className="p-6 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
            {article.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <span>
              🔑 Keyword: <strong>{article.primaryKeyword}</strong>
            </span>
            <span>
              📊 Type:{" "}
              <strong>
                {article.articleType === "pillar"
                  ? "📋 Pillar"
                  : "📝 Supporting"}
              </strong>
            </span>
            <span>📅 {new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          variants={itemVariants}
        >
          <motion.button
            onClick={copyJson}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📋 Copy JSON-LD
          </motion.button>
          <motion.button
            onClick={downloadPDF}
            disabled={exporting}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              exporting
                ? "bg-slate-600 opacity-50 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500"
            }`}
            whileHover={!exporting ? { scale: 1.05 } : {}}
            whileTap={!exporting ? { scale: 0.95 } : {}}
          >
            {exporting ? "⏳ Generating PDF..." : "📥 Download PDF"}
          </motion.button>
        </motion.div>

        {/* Content */}
        <motion.div
          id="article-content"
          className="space-y-6"
          variants={itemVariants}
        >
          {/* Meta Description */}
          <motion.div
            className="bg-slate-800 p-6 rounded-lg border border-slate-700"
            variants={itemVariants}
          >
            <h2 className="font-bold text-lg mb-3 text-indigo-300">
              🏷️ Meta Description
            </h2>
            <p className="text-slate-300 leading-relaxed">
              {article.metaDescription}
            </p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="bg-slate-800 p-6 rounded-lg border border-slate-700"
            variants={itemVariants}
          >
            <h2 className="font-bold text-lg mb-4 text-indigo-300">
              📖 Content
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </p>
            </div>
          </motion.div>

          {/* FAQs */}
          {article.faqs && article.faqs.length > 0 && (
            <motion.div
              className="bg-slate-800 p-6 rounded-lg border border-slate-700"
              variants={itemVariants}
            >
              <h2 className="font-bold text-lg mb-4 text-indigo-300">
                ❓ Frequently Asked Questions
              </h2>
              <motion.div className="space-y-4" variants={containerVariants}>
                {article.faqs.map((faq, i) => (
                  <motion.details
                    key={i}
                    className="border border-slate-600 rounded-lg p-4 hover:border-indigo-500 transition-colors cursor-pointer"
                    variants={itemVariants}
                  >
                    <summary className="font-semibold text-slate-200 cursor-pointer hover:text-indigo-300">
                      Q: {faq.question}
                    </summary>
                    <p className="text-slate-400 mt-3 pl-4 border-l border-indigo-500">
                      A: {faq.answer}
                    </p>
                  </motion.details>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* JSON-LD Preview */}
          <motion.div
            className="bg-slate-800 p-6 rounded-lg border border-slate-700"
            variants={itemVariants}
          >
            <h2 className="font-bold text-lg mb-3 text-indigo-300">
              ⚙️ JSON-LD Schema
            </h2>
            <pre className="bg-slate-900 p-4 rounded text-xs text-slate-300 overflow-x-auto max-h-48">
              {JSON.stringify(article.jsonLd, null, 2)}
            </pre>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
