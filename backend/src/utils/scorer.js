import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_KEY = process.env.GEMINI_API_KEY || null;
const aiClient = GEMINI_KEY ? new GoogleGenAI({ apiKey: GEMINI_KEY }) : null;


export function rulesScore(offer, lead) {
  let pts = 0;


  const roleKeywords = (offer.ideal_use_cases || [])
    .flatMap((s) => s.split(/\W+/))
    .filter(Boolean)
    .map((w) => w.toLowerCase());
  const role = (lead.role || "").toLowerCase();
  for (const kw of roleKeywords) {
    if (role.includes(kw)) {
      pts += 5;
      break;
    }
  }

  // industry match (up to 20)
  if (lead.industry && offer.value_props) {
    for (const vp of offer.value_props) {
      if (lead.industry.toLowerCase().includes(vp.toLowerCase())) {
        pts += 20;
        break;
      }
    }
  }

  const required = ["name", "role", "company", "industry", "linkedin_bio"];
  const missing = required.filter(
    (k) => !lead[k] || lead[k].toString().trim() === ""
  );
  pts += (required.length - missing.length) * (10 / required.length);

  if (pts > 50) pts = 50;
  return Math.round(pts);
}


export async function aiScore(offer, lead) {
  const prompt = [
    "You are a lead qualification assistant.",
    `Offer: ${JSON.stringify(offer)}`,
    `Lead: ${JSON.stringify(lead)}`,
    "Answer in this exact format (no extra commentary):",
    "INTENT: <High|Medium|Low>",
    "REASONING: <one-sentence justification, 1-2 lines>",
  ].join("\n\n");

  if (aiClient) {
    try {
      const resp = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
        config: { thinkingConfig: { thinkingBudget: 0 } },
      });

      const returnedText =
        resp?.text ||
        resp?.candidates?.[0]?.content?.parts?.[0]?.text ||
        (typeof resp === "string" ? resp : "") ||
        "";

      const text = returnedText.trim();

      const match = /\b(High|Medium|Low)\b/i.exec(text);
      const label = match ? match[1] : "Medium";
      const pts =
        label.toLowerCase() === "high"
          ? 50
          : label.toLowerCase() === "medium"
            ? 30
            : 10;

      let reasoning = "";
      const reasonMatch = /REASONING:\s*(.+)$/ims.exec(text);
      if (reasonMatch) reasoning = reasonMatch[1].trim();
      else reasoning = text.replace(/INTENT:\s*(High|Medium|Low)/i, "").trim();

      return { label, pts, reasoning: reasoning || text };
    } catch (err) {
      console.warn(
        "Gemini call failed, falling back to heuristic. Error:",
        err?.message || err
      );
    }
  }

  const bio = (lead.linkedin_bio || "").toLowerCase();
  const positive = [
    "interested",
    "evaluating",
    "looking",
    "implement",
    "buy",
    "purchas",
    "decision maker",
    "cto",
    "founder",
    "co-founder",
    "director",
    "head of",
  ];
  let score = 0;
  for (const p of positive) if (bio.includes(p)) score++;
  const label = score >= 2 ? "High" : score === 1 ? "Medium" : "Low";
  const pts = label === "High" ? 50 : label === "Medium" ? 30 : 10;
  const reasoning = `Heuristic: matched ${score} positive keywords in linkedin_bio.`;

  return { label, pts, reasoning };
}
