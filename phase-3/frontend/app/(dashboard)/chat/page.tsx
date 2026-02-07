"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/layout/PageTransition";

export default function ChatPage() {
  const { userId } = useAuth();
  const [conversationId, setConversationId] = useState<number | null>(null);

  if (!userId) return null;

  return (
    <PageTransition>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <h1 className="font-heading text-lg font-semibold">AI Chat</h1>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setConversationId(null)}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            userId={userId}
            conversationId={conversationId}
            onConversationCreated={setConversationId}
          />
        </div>
      </div>
    </PageTransition>
  );
}
