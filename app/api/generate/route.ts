import { NextRequest, NextResponse } from "next/server";
import { generateContent, GenerateInput } from "@/lib/contentGenerator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, platform, tone, userProfile } = body as GenerateInput;

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    if (topic.trim().length < 3) {
      return NextResponse.json(
        { error: "Topic must be at least 3 characters" },
        { status: 400 }
      );
    }

    const content = await generateContent({
      topic: topic.trim(),
      platform: platform || "all",
      tone: tone || "professional",
      userProfile: userProfile || "",
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
