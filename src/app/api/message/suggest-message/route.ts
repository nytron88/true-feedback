import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const token = await requireAuth(request);
  if (token instanceof NextResponse) return token;

  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      prompt,
      maxTokens: 500,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    // Handle OpenAI-specific errors
    if (error?.name === "OpenAIError") {
      const statusCode = error.status || 500;
      return NextResponse.json(
        {
          success: false,
          message: error.message || "OpenAI API error occurred",
          error: {
            type: error.type,
            code: error.code,
          },
        },
        { status: statusCode }
      );
    }

    // Handle validation errors
    if (error?.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request format",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle rate limiting errors
    if (error?.status === 429) {
      return NextResponse.json(
        {
          success: false,
          message: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Handle timeout errors
    if (error?.name === "TimeoutError") {
      return NextResponse.json(
        {
          success: false,
          message: "Request timed out. Please try again.",
        },
        { status: 408 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}
