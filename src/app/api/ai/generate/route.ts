import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { aiGenerations } from "@/lib/db/schema";

const CONTENT_TYPE_PROMPTS: Record<string, string> = {
  caption: "Você é um especialista em social media. Crie legendas criativas, engajantes e com emojis relevantes para Instagram/Facebook.",
  script: "Você é um roteirista especialista em vídeos curtos. Crie roteiros dinâmicos com gancho inicial, desenvolvimento e CTA.",
  blog: "Você é um redator experiente. Crie artigos de blog completos, otimizados para SEO, com introdução, desenvolvimento e conclusão.",
  ad_copy: "Você é um copywriter especialista em anúncios digitais. Crie textos persuasivos com headline forte, benefícios claros e CTA irresistível.",
  email: "Você é um especialista em email marketing. Crie emails com subject line atraente, corpo envolvente e CTA claro.",
  description: "Você é um especialista em descrições de produtos/serviços. Crie descrições detalhadas, persuasivas e que destaquem os diferenciais.",
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { contentType, prompt, projectId, tone, variations = 1 } = body;

    if (!contentType || !prompt) {
      return NextResponse.json(
        { error: "contentType e prompt são obrigatórios" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key não configurada. Adicione OPENROUTER_API_KEY no .env.local" },
        { status: 503 }
      );
    }

    const systemPrompt = CONTENT_TYPE_PROMPTS[contentType] ?? CONTENT_TYPE_PROMPTS.caption;
    const toneInstruction = tone ? `\n\nTom de voz: ${tone}` : "";
    const variationsInstruction = variations > 1
      ? `\n\nGere ${variations} variações numeradas (1., 2., etc.), cada uma com abordagem diferente.`
      : "";

    const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "Eter Comunicações — AI Studio",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt + toneInstruction + variationsInstruction },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter error:", error);
      return NextResponse.json({ error: "Falha na geração de conteúdo" }, { status: 502 });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content ?? "";
    const tokensUsed = data.usage?.total_tokens ?? null;

    // Save to database
    const [generation] = await db.insert(aiGenerations).values({
      projectId: projectId || null,
      userId: session.user.id,
      contentType,
      prompt,
      result,
      model,
      tokensUsed,
    }).returning();

    return NextResponse.json({ result, generationId: generation.id, tokensUsed });
  } catch (error) {
    console.error("Failed to generate content:", error);
    return NextResponse.json({ error: "Falha ao gerar conteúdo" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const history = await db.query.aiGenerations.findMany({
      orderBy: (gen, { desc }) => [desc(gen.createdAt)],
      limit: 50,
      with: {
        project: { columns: { id: true, name: true } },
      },
      ...(projectId ? { where: (gen, { eq }) => eq(gen.projectId, projectId) } : {}),
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to fetch generations:", error);
    return NextResponse.json({ error: "Falha ao buscar histórico" }, { status: 500 });
  }
}
