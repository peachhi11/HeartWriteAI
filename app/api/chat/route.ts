import { handleChatRequest } from "@/lib/chat/chatRoute";

export async function POST(request: Request): Promise<Response> {
  return handleChatRequest(request);
}
