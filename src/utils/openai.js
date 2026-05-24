/**
 * Calls the Groq API (free tier) to generate structured notes.
 * Model: llama-3.3-70b-versatile — fast, free, no credit card needed.
 * Get your free key at: https://console.groq.com
 *
 * @param {string} apiKey - Groq API key (starts with gsk_)
 * @param {string} inputText - Raw text to convert into notes
 * @param {string} noteStyle - 'structured' | 'summary' | 'bullets' | 'cornell'
 * @returns {Promise<Object>} - Parsed notes object
 */
export async function generateNotes(apiKey, inputText, noteStyle = 'structured') {
  const prompts = {
    structured: `You are an expert note-taker. Convert the following raw text into well-structured, intelligent notes.

Return a JSON object with this exact structure:
{
  "title": "A concise, descriptive title for this content",
  "summary": "A 2-3 sentence executive summary of the content",
  "keyPoints": ["array", "of", "4-6", "key", "takeaways"],
  "sections": [
    {
      "heading": "Section heading",
      "content": "Section content in clear prose",
      "bullets": ["optional", "bullet", "points"]
    }
  ],
  "tags": ["relevant", "topic", "tags"],
  "actionItems": ["any", "action", "items", "if", "present"],
  "wordCount": 0
}

IMPORTANT: Return ONLY the raw JSON. No markdown, no code fences, no explanation.

Raw text to convert:
${inputText}`,

    summary: `You are an expert summarizer. Create a concise summary of the following text.

Return ONLY a raw JSON object (no markdown, no code fences):
{
  "title": "Title",
  "summary": "Comprehensive 4-5 sentence summary",
  "keyPoints": ["5-7 key points"],
  "sections": [{"heading": "Main Topics", "content": "Overview of main topics", "bullets": ["topic1", "topic2"]}],
  "tags": ["tags"],
  "actionItems": [],
  "wordCount": 0
}

Text:
${inputText}`,

    bullets: `Convert the following text into clear, organized bullet-point notes.

Return ONLY a raw JSON object (no markdown, no code fences):
{
  "title": "Title",
  "summary": "Brief 1-2 sentence overview",
  "keyPoints": ["key point 1", "key point 2"],
  "sections": [
    {
      "heading": "Category",
      "content": "",
      "bullets": ["bullet 1", "bullet 2", "bullet 3"]
    }
  ],
  "tags": ["tags"],
  "actionItems": ["action items if any"],
  "wordCount": 0
}

Text:
${inputText}`,

    cornell: `Create Cornell-style notes from the following text.

Return ONLY a raw JSON object (no markdown, no code fences):
{
  "title": "Title",
  "summary": "Bottom summary section: key conclusion in 2-3 sentences",
  "keyPoints": ["Cue column questions/keywords"],
  "sections": [
    {
      "heading": "Notes Column",
      "content": "Detailed notes from the content",
      "bullets": ["Supporting detail 1", "Supporting detail 2"]
    }
  ],
  "tags": ["subject", "tags"],
  "actionItems": ["Review items or follow-up tasks"],
  "wordCount": 0
}

Text:
${inputText}`,
  };

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional note-taking assistant. Always return valid JSON only. No markdown code blocks, no backticks, no preamble, no explanation — raw JSON only.',
        },
        {
          role: 'user',
          content: prompts[noteStyle] || prompts.structured,
        },
      ],
      temperature: 0.4,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message = err?.error?.message || `Groq API error: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '';

  // Strip markdown fences if model adds them anyway
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    // Always compute real word count from input
    parsed.wordCount = countWords(inputText);
    return parsed;
  } catch {
    return {
      title: 'Generated Notes',
      summary: cleaned.slice(0, 300),
      keyPoints: ['Unable to parse structured response. Raw output shown below.'],
      sections: [{ heading: 'Raw Output', content: cleaned, bullets: [] }],
      tags: [],
      actionItems: [],
      wordCount: countWords(inputText),
    };
  }
}

/**
 * Count words in a string
 */
export function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Estimate reading time in minutes
 */
export function estimateReadTime(text) {
  const words = countWords(text);
  return Math.ceil(words / 200);
}
