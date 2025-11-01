import fetch from 'node-fetch';

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
const generateContent = asyncHandler(async (req, res) => {
  const { topicText } = req.body;

  if (!topicText || !topicText.trim()) {
    res.status(400);
    throw new Error("Please provide a topic for content generation");
  }

  const prompt = `
You are an Expert Content Creator.

Your task:
Create engaging, platform-tailored social media post content for the independent platforms:
- title
- body
- hashtags
- an image prompt for ai model

For single social platform:
1. Generate text content appropriate to the platform’s style.
2. Include an image prompt that visually represents the post — this image prompt will be used with the Ai model.

Input Topic: ${topicText}

Return a valid JSON array like this:
[
  {
    "platform": "Facebook",
    "title": "string | null",
    "body": "string",
    "hashtags": ["#hashtag1", "#hashtag2"],
    "imagePrompt": "Detailed prompt for Ai (describe the visual concept, style, and subject clearly)"
  }
]

Guidelines:
- The image prompt should describe what the image should visually depict, including emotion, color tone, and composition.

Only return the JSON array above(arry and only one object). Do NOT include any extra commentary.
`.trim();

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENROUTER_API_KEY");
      return res.status(500).json({ message: "Server misconfiguration: missing API key" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // keep extra headers minimal; only include what you need
      },
      body: JSON.stringify({
        model: "tngtech/deepseek-r1t2-chimera:free",
        messages: [{ role: "user", content: prompt }],
        // you can add temperature, max_tokens, etc., if supported by the endpoint
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      // try to parse JSON error body if possible
      let errBody;
      try { errBody = JSON.parse(text); } catch { errBody = text; }
      console.error("OpenRouter error:", response.status, errBody);
      return res.status(response.status).json({ message: "Model API error", details: errBody });
    }

    // Try to parse the response JSON if it's valid JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // If response isn't strict JSON, try to parse it as text->JSON later
      data = null;
    }

    // Extract model's textual output in a few common shapes
    const rawOutput =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      data?.output_text ??
      (typeof text === "string" ? text : null);

    if (!rawOutput) {
      console.error("No output from model:", { data, text });
      return res.status(500).json({ message: "No content returned from model" });
    }

    // Attempt to extract a JSON array from the model output (safe parse)
    let generatedContent;
    try {
      // If it's already a parsed object/array, use it
      if (Array.isArray(rawOutput)) {
        generatedContent = rawOutput;
      } else if (typeof rawOutput === "object") {
        generatedContent = rawOutput;
      } else {
        // rawOutput is a string — try direct parse first
        try {
          generatedContent = JSON.parse(rawOutput);
        } catch {
          // attempt to extract the JSON array substring using regex
          const match = rawOutput.match(/\[[\s\S]*\]$/) || rawOutput.match(/\[[\s\S]*\]/);
          if (match) {
            generatedContent = JSON.parse(match[0]);
          } else {
            throw new Error("Unable to find JSON array in model output");
          }
        }
      }
    } catch (err) {
      console.error("Failed to parse generated content:", err, { rawOutput });
      return res.status(500).json({
        message: "Failed to parse model output. Ensure model returns valid JSON array.",
        rawOutput: rawOutput.slice ? rawOutput.slice(0, 2000) : rawOutput, // include truncated raw output for debugging
      });
    }

    // Validate final shape minimally
    if (!Array.isArray(generatedContent)) {
      return res.status(500).json({ message: "Parsed content is not an array", generatedContent });
    }

    // Success
    res.status(200).json(generatedContent);
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ message: "Server error during content generation", error: error.message });
  }
});

export { generateContent };



