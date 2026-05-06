import { GoogleGenerativeAI } from '@google/generative-ai';

const provider = process.env.LLM_PROVIDER || 'gemini';
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ollamaModel = process.env.OLLAMA_MODEL || 'gemma2:9b';
const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

const nvidiaApiKey = process.env.NVIDIA_API_KEY || '';
const nvidiaModel = process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct';
const nvidiaBaseUrl = 'https://integrate.api.nvidia.com/v1';

const genAI = new GoogleGenerativeAI(geminiApiKey);

async function callOllama(prompt: string, isJson: boolean = true, imageData?: string) {
  try {
    const body: any = {
      model: ollamaModel,
      prompt: prompt,
      stream: false,
    };

    if (isJson) body.format = 'json';
    if (imageData) body.images = [imageData];

    const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Ollama Error:", error);
    throw error;
  }
}

async function callNvidia(prompt: string, isJson: boolean = true, imageData?: string, mimeType?: string) {
  try {
    const messages: any[] = [
      {
        role: "user",
        content: imageData 
          ? [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageData}` } }
            ]
          : prompt
      }
    ];

    const response = await fetch(`${nvidiaBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nvidiaApiKey}`
      },
      body: JSON.stringify({
        model: imageData ? (process.env.NVIDIA_VISION_MODEL || 'nvidia/llama-3.2-11b-vision-instruct') : nvidiaModel,
        messages: messages,
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 4096,
        stream: false,
        response_format: isJson ? { type: "json_object" } : undefined
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`NVIDIA API Error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("NVIDIA Error:", error);
    throw error;
  }
}

export async function getAIResponse(prompt: string, isJson: boolean = true, imageData?: string, mimeType?: string) {
  if (provider === 'ollama') {
    return await callOllama(prompt, isJson, imageData);
  } else if (provider === 'nvidia') {
    if (!nvidiaApiKey) throw new Error("NVIDIA API Key missing");
    return await callNvidia(prompt, isJson, imageData, mimeType);
  } else {
    if (!geminiApiKey) throw new Error("Gemini API Key missing");
    
    const modelToUse = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: isJson ? "application/json" : "text/plain",
        temperature: 0.3
      }
    });

    if (imageData && mimeType) {
      const result = await modelToUse.generateContent([
        { inlineData: { data: imageData, mimeType } },
        prompt,
      ]);
      return result.response.text();
    } else {
      const result = await modelToUse.generateContent(prompt);
      return result.response.text();
    }
  }
}
