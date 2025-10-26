"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { addMessage } from "@/store/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const examplePrompts = [
  "জীবনের অর্থ কী?",
  "কোয়ান্টাম কম্পিউটিং সহজ ভাষায় ব্যাখ্যা করুন।",
  "সঙ্গীত আবিষ্কারকারী একজন রোবট সম্পর্কে একটি ছোট গল্প লিখুন।",
  "আমি কীভাবে একটি নিখুঁত অমলেট তৈরি করব?",
];

export function EmptyScreen() {
  const dispatch = useAppDispatch();
  const currentConversationId = useAppSelector(state => state.chat.currentConversationId);

  const handlePromptClick = (prompt: string) => {
    if (currentConversationId) {
      dispatch(addMessage({
        conversationId: currentConversationId,
        message: { role: "user", content: prompt }
      }));
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-lg px-4">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-center font-headline text-3xl font-semibold">
            ভাবকনায় স্বাগতম!
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {examplePrompts.map((prompt, i) => (
            <Card
              key={i}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => handlePromptClick(prompt)}
            >
              <CardContent className="p-4">
                <p className="text-sm">{prompt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
