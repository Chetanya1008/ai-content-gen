export interface GenerateInput {
  topic: string;
  platform: string;
  tone: string;
  userProfile: string;
}

export interface GeneratedContent {
  linkedin: string;
  twitter: string;
  instagram: string;
  imagePrompt: string;
}

// ─── Template helpers ─────────────────────────────────────────────────────────

const toneWords: Record<string, string[]> = {
  professional: ["insight", "strategy", "framework", "excellence", "methodology"],
  casual:       ["honestly", "real talk", "heads up", "quick thought", "ngl"],
  creative:     ["imagine", "picture this", "what if", "bold idea", "wild take"],
};

const linkedinHashtags = ["#LinkedInLearning", "#ProfessionalGrowth", "#CareerAdvice", "#Networking", "#ThoughtLeadership"];
const twitterHashtags  = ["#trending", "#growth", "#mindset", "#productivity", "#ai"];
const igHashtags       = ["#instagood", "#explore", "#viral", "#trending", "#motivation", "#mindset", "#success", "#inspiration"];

function profileCtx(profile: string): string {
  const map: Record<string, string> = {
    developer:  "As a developer building real solutions, ",
    marketer:   "From a marketing perspective, ",
    designer:   "Through a design-thinking lens, ",
    founder:    "As someone building from scratch, ",
    educator:   "As an educator who loves knowledge-sharing, ",
  };
  const key = profile.toLowerCase().trim();
  for (const k of Object.keys(map)) {
    if (key.includes(k)) return map[k];
  }
  return profile ? `As a ${profile}, ` : "";
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Per-platform templates ───────────────────────────────────────────────────

function linkedin(input: GenerateInput): string {
  const { topic, tone, userProfile } = input;
  const word = pick(toneWords[tone] || toneWords.professional);
  const ctx  = profileCtx(userProfile);
  const tags = linkedinHashtags.slice(0, 3).join(" ");

  const variants = [
    `${ctx}I've been diving deep into ${topic} — and what I discovered changed how I approach my work entirely.\n\nHere's the ${word} most people miss:\n\n→ The obvious approach is rarely the best one\n→ Compounding small actions outperforms single big moves\n→ The real leverage is in the questions you ask, not the answers you chase\n\nWe spend so much time optimising the "how" that we forget to interrogate the "why."\n\nIf you're working on ${topic} right now — what's the biggest obstacle you're running into? Drop it below 👇\n\n${tags} #Innovation`,

    `${topic} is reshaping how top performers work in 2025.\n\n${ctx}here's what I've observed after going deep on this:\n\n1️⃣ Most people treat it as a tactic, not a system\n2️⃣ The compounding effect only kicks in after 30+ days of consistency\n3️⃣ The winners aren't the smartest — they're the most intentional\n\nThe ${word} I keep coming back to: it's not about doing more. It's about doing the right things in the right order.\n\nSave this if it resonates. And tag someone who needs to hear it.\n\n${tags} #GrowthMindset`,
  ];

  return pick(variants);
}

function twitter(input: GenerateInput): string {
  const { topic, tone } = input;
  const word = pick(toneWords[tone] || toneWords.casual);
  const tags = twitterHashtags.slice(0, 3).join(" ");

  const variants = [
    `${word}: most people overcomplicate ${topic}.\n\nThe simple version:\n→ Focus on what moves the needle\n→ Cut the noise ruthlessly\n→ Repeat what works\n\nThat's it.\n\n${tags}`,
    `Hot take: ${topic} is one of the most underrated skills you can build right now.\n\nChange my mind. 👀\n\n${tags}`,
    `Spent 30 days going deep on ${topic}.\n\nThe one thing nobody tells you: it's not about doing more. It's about stopping the things that don't work.\n\n${tags}`,
  ];

  return pick(variants);
}

function instagram(input: GenerateInput): string {
  const { topic } = input;
  const topicTag = `#${topic.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "")}`;
  const allTags  = [topicTag, ...igHashtags, "#content", "#creator"].join(" ");
  const emojiSets = ["✨🚀💡", "🔥💪🎯", "🌟💫⚡", "🎨🌈✨", "💎🙌🔑"];
  const emojis = pick(emojiSets);

  const variants = [
    `${emojis} Real talk about ${topic} — because someone has to say it.\n\nMost people: ❌ chase tactics\nWinners: ✅ build systems\n\nThe difference?\nConsistency beats intensity. Every. Single. Time.\n\nSave this for when you need a reminder 📌\nDouble tap if this hits! ❤️\n.\n.\n.\n${allTags}`,

    `POV: You finally cracked the code on ${topic} ${emojis}\n\nIt was never about having all the answers.\nIt was about asking better questions.\n\nTag someone who needs to hear this 👇\n.\n.\n.\n${allTags}`,
  ];

  return pick(variants);
}

function imagePrompt(input: GenerateInput): string {
  const { topic, tone } = input;
  const styleMap: Record<string, string> = {
    professional: "clean corporate photography, natural lighting, shallow depth of field, muted tones",
    casual:       "candid lifestyle photography, warm golden-hour tones, authentic real-world feel",
    creative:     "vibrant digital art, bold color palette, dynamic composition, futuristic energy",
  };
  const style = styleMap[tone] || styleMap.professional;
  return `A visually compelling scene representing "${topic}" — ${style}. Incorporate subtle visual metaphors like upward trajectories, interconnected nodes, or breakthrough moments. Color palette: deep navy with warm gold accents. Ultra-realistic, award-winning photography composition, 8K resolution. No text overlays. Suitable for both 16:9 (LinkedIn/Twitter) and 1:1 (Instagram) cropping.`;
}

// ─── Main export — runs entirely in the browser ───────────────────────────────

// export function generateContent(input: GenerateInput): GeneratedContent {
//   return {
//     linkedin:    linkedin(input),
//     twitter:     twitter(input),
//     instagram:   instagram(input),
//     imagePrompt: imagePrompt(input),
//   };
// }


export async function generateContent(input: GenerateInput): Promise<GeneratedContent> {
  const apiKey = process.env.OPENAI_API_KEY;

  // Fallback if no API key
  if (!apiKey) {
    return {
      linkedin: linkedin(input),
      twitter: twitter(input),
      instagram: instagram(input),
      imagePrompt: imagePrompt(input),
    };
  }

  try {
    const prompt = `
Generate social media content for the following:

Topic: ${input.topic}
Tone: ${input.tone}

Give output in this EXACT format:

LinkedIn:
Write a professional LinkedIn post.

Twitter:
Write a short and catchy tweet (max 280 characters).

Instagram:
Write an engaging Instagram caption with emojis and hashtags.

Image Prompt:
Describe an image for this topic.

IMPORTANT:
- Keep each section clearly separated
- Do NOT mix sections
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Content Generator"
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    console.log("FULL API RESPONSE:", data);

    const text = data.choices?.[0]?.message?.content || "";

    // 🧠 Split response into sections
    function extractSection(text: string, label: string) {
  const regex = new RegExp(`${label}:([\\s\\S]*?)(?=\\n\\w+:|$)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

const linkedinText = extractSection(text, "LinkedIn");
const twitterText = extractSection(text, "Twitter");
const instagramText = extractSection(text, "Instagram");
const imageText = extractSection(text, "Image Prompt");

return {
  linkedin: linkedinText || "No LinkedIn content generated",
  twitter: twitterText || "No Twitter content generated",
  instagram: instagramText || "No Instagram content generated",
  imagePrompt: imageText || "No image prompt generated",
};

  } catch (error) {
    console.error("AI Error:", error);

    // fallback
    return {
      linkedin: linkedin(input),
      twitter: twitter(input),
      instagram: instagram(input),
      imagePrompt: imagePrompt(input),
    };
  }
}