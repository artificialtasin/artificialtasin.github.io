import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ reply: "Server error: API key is missing." });
    }

    // ফ্রন্টএন্ড থেকে মেসেজ ঠিকমতো আসছে কি না তা চেক করা
    if (!message) {
      return NextResponse.json({ reply: "Client error: No message provided." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      }),
    });

    const data = await response.json();

    // গুগল এপিআই যদি কোনো এরর দেয়, সেটা এখানে ধরা পড়বে
    
    if (!response.ok) {
      return NextResponse.json({ reply: `Gemini API Error: ${data.error?.message || 'Unknown error'}` });
    }

    if (data.candidates && data.candidates.length > 0) {
      const reply = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ reply: reply });
    } else {
      return NextResponse.json({ reply: "Sorry, no response received from the server." });
    }
    
  } catch (error) {
    return NextResponse.json({ reply: `Server error: ${error.message}` });
  }
}
