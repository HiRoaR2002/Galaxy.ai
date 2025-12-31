import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const RequestSchema = z.object({
  model: z.enum(["gemini-2.5-flash"]),
  systemPrompt: z.string().optional(),
  userMessage: z.string(),
  images: z.array(z.string()).optional(), // Expecting base64 data URLs
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = RequestSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validatedData.error.issues },
        { status: 400 }
      );
    }

    const { model, systemPrompt, userMessage, images } = validatedData.data;
    
    // Server-side environment check for safety
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server Configuration Error: Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ 
        model: model,
        systemInstruction: systemPrompt ? { role: "system", parts: [{ text: systemPrompt }] } : undefined
    });

    const promptParts: Part[] = [{ text: userMessage }];

    if (images && images.length > 0) {
      images.forEach((imgDataUrl) => {
        // Extract base64 part
        // Format: data:image/png;base64,.....
        const matches = imgDataUrl.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
            promptParts.push({
                inlineData: {
                    mimeType: matches[1],
                    data: matches[2]
                }
            });
        }
      });
    }

    const result = await geminiModel.generateContent(promptParts);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "An error occurred during generation";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
