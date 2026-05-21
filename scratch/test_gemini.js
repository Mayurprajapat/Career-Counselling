require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function discover() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // List models
    try {
        console.log("Listing models...");
        // In @google/generative-ai, listModels might not be available or needs client/admin credentials.
        // Let's test a few common ones directly:
        const models = [
            "gemini-2.5-flash",
            "gemini-2.0-flash-lite-preview-02-05",
            "gemini-2.0-flash-lite",
            "gemini-1.5-pro",
            "gemini-1.5-flash",
            "gemini-2.0-flash"
        ];
        
        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("hi");
                console.log(`✅ Model '${modelName}' is fully working:`, result.response.text().trim());
                break; // Found a working one!
            } catch (err) {
                console.log(`❌ Model '${modelName}' failed:`, err.message);
            }
        }
    } catch (e) {
        console.error("Discovery error:", e.message);
    }
}

discover();
