"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ChatHistory } from "./chat-history";
import { ChatPanel } from "./chat-panel";
import { ThemeToggle } from "../theme-toggle";
import { Bot, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewConversation } from "@/store/features/chat/chatSlice";

export function ChatLayout() {
  const dispatch = useAppDispatch();
  const currentConversation = useAppSelector(state => 
    state.chat.conversations.find(conv => conv.id === state.chat.currentConversationId)
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="w-full md:w-[260px]" collapsible="offcanvas">
          <SidebarHeader>
            <div className="flex w-full items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <h1 className="font-headline text-lg font-semibold">ভাবকণা</h1>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <Button
              variant="outline"
              className="w-full justify-start smooth-transition"
              onClick={() => dispatch(createNewConversation())}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
            <ChatHistory />
          </SidebarContent>
          <SidebarFooter>
            <div className="p-2">
              <ThemeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <div className="flex h-full flex-col">
            <header className="flex h-14 items-center gap-4 border-b px-4 backdrop-blur-sm md:px-6">
              <div>
                <SidebarTrigger />
              </div>
              <div className="flex-1">
                <h2 className="truncate text-lg font-semibold">
                  {currentConversation?.title}
                </h2>
              </div>
            </header>
            <ChatPanel />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
