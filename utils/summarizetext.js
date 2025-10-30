 
const dotenv = require('dotenv');
dotenv.config();

const HF_API_KEY = process.env.HF_API_KEY;
 const summarizetext = async (content) => {
  const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: content }),
  });

  const data = await response.json();
  console.log("Raw HF response:", data);

  if (data.error) {
    console.error("Hugging Face API error:", data.error);
    return "Model loading or error occurred.";
  }

  const text = data[0]?.summary_text || "No summary generated.";
  return text;
};

module.exports = summarizetext; 