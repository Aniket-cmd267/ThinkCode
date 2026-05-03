const validateResumeScore = (text) => {
    let score = 0;
    if (!text || typeof text !== "string") return 0;
    const lowerText = text.toLowerCase();
    const words = text.trim().split(/\s+/);

    // -------------------------------
    // 1. KEYWORDS CHECK (Content Signal)
    // -------------------------------
    const keywords = ["education", "experience", "skills", "projects", "achievements"];
    const foundKeywords = keywords.filter(word => lowerText.includes(word));
    if (foundKeywords.length >= 2) score++;
    // -------------------------------
    // 2. EMAIL DETECTION
    // -------------------------------
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    if (emailRegex.test(text)) score++;
    // -------------------------------
    // 3. PHONE NUMBER DETECTION
    // -------------------------------
    const phoneRegex = /(\+?\d{1,3}[\s-]?)?\d{10}/;
    if (phoneRegex.test(text)) score++;
    // -------------------------------
    // 4. SECTION STRUCTURE DETECTION (Strong Signal)
    // -------------------------------
    const lines = text.split('\n');
    const sectionKeywords = ["education", "experience", "skills", "projects", "achievements"];
    const headingCount = lines.filter(line => {
        const trimmed = line.trim().toLowerCase();
        return (
            trimmed.length > 0 &&
            trimmed.length < 60 && // headings are usually short
            sectionKeywords.some(section => trimmed.startsWith(section))
        );
    }).length;
    if (headingCount >= 2) score++;
    // -------------------------------
    // 5. LENGTH CHECK (Sanity)
    // -------------------------------
    if (words.length >= 100 && words.length <= 5000) score++;
    return score;
};

module.exports = { validateResumeScore };
