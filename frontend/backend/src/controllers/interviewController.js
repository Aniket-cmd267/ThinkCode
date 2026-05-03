const pdf = require('pdf-parse-new');

const { GoogleGenAI } = require("@google/genai");
const { validateResumeScore } = require('../utils/resumeValidator');

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_KEY
});

const processResumeValidation = async (req, res) => {
    try {
        console.log('File: ', req.file);

        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "No file uploaded or file buffer missing" });
        }

        // const pdf = typeof pdfParse === "function" ? pdfParse :
        //     (pdfParse && typeof pdfParse.default === "function" ? pdfParse.default : null);

        // if (!pdf) {
        //     console.error('pdf-parse import is not callable:', pdfParse);
        //     return res.status(500).json({ message: "PDF parser is unavailable" });
        // }

        // -------------------------------
        // STEP 1: EXTRACT TEXT
        // -------------------------------
        const pdfData = await pdf(req.file.buffer);
        if (!pdfData || typeof pdfData.text !== 'string') {
            return res.status(500).json({ message: "Unable to extract text from the uploaded PDF" });
        }
        // console.log(pdfData);
        const extractedText = pdfData.text || "";
        console.log(extractedText)
        // -------------------------------
        // STEP 2: BACKEND VALIDATION
        // -------------------------------
        console.log("No error")
        const backendScore = validateResumeScore(extractedText);
        console.log("No error")
        // -------------------------------
        // STEP 3: AI CLASSIFICATION (FIXED)
        // -------------------------------
        const prompt = `
Strictly classify the following document text as either:

VALID_RESUME
NOT_RESUME

Rules:
- A resume must contain professional or academic information. 
- Also the resume 
- Reject SOPs, essays, reports, articles, or random text
- Be strict but fair

Document Text:
"${extractedText.substring(0, 2000)}"

Return ONLY one word: VALID_RESUME or NOT_RESUME
        `;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const aiDecision = result.text.trim();

        // -------------------------------
        // STEP 4: FINAL DECISION
        // -------------------------------
        const finalDecision =
            (backendScore >= 3 && aiDecision === "VALID_RESUME")
                ? "ACCEPT"
                : "REJECT";

        let reason = "";
        if (finalDecision === "ACCEPT") {
            reason = "Passed backend checks + AI validation.";
        } else {
            reason = backendScore < 3
                ? "Failed backend structural checks."
                : "AI classified as non-resume.";
        }

        // -------------------------------
        // RESPONSE
        // -------------------------------
        return res.status(200).json({
            backend_score: backendScore,
            ai_decision: aiDecision,
            final_decision: finalDecision,
            reason: reason
        });

    } catch (error) {
        console.error("Validation Error:", error);
        return res.status(500).json({
            message: "Internal server error during validation"
        });
    }
};

module.exports = { processResumeValidation };