const summarizetext= require("../utils/summarizetext");
const Article = require('../models/Article');
const Summary = require('../models/Summary');

class SummaryController {
    static createSummary = async (req, res) => {
        try {
            const { content } = req.body;
            const id = req.user.id;
            console.log(id);
            if (!content) {
                return res.status(400).json({ message: "content is required" });
            }
            const article = await Article.create({ content, author: id });
            const text = await summarizetext(content);
            console.log("hello");
            console.log(text);
            const summary = await Summary.create({
                article: article._id,
                summaryText: text,
                createdBy:id
            }); 
            res.status(201).json(summary);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static getAll = async (req, res) => {
    try {
      const id = req.user.id;  
      const summaries = await Summary.find({ createdBy: id })
        .populate("article","content")
        .sort({ createdAt: -1 });
 
      res.json(summaries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching history" });
    }
    };
    static getSummary = async (req, res) => {
    try {
      const { id } = req.params;
      const sumry = await Summary.findById(id).populate("article");
      if (!sumry) return res.status(404).json({ message: "Not found" });
      res.json(sumry);
    } catch (error) {
      res.status(500).json({ message: "Error fetching article" });
    }
  };
    static deleteSummary = async (req, res) => {
        try {
            const { id } = req.params;
            const summary = await Summary.findByIdAndDelete(id);

            if (!summary) {
                return res.status(404).json({ message: "Summary not found" });
            }

            await Article.findByIdAndDelete(summary.article);

            res.status(200).json({ message: "Summary and related article deleted" });
        }
        catch (error) {
          res.status(500).json({ message: "Error" })
        }
    }
     
};
module.exports = SummaryController;