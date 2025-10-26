"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { MessageSquare, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentConversationId, clearConversation } from "@/store/features/chat/chatSlice";

export function ChatHistory() {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(state => state.chat.conversations);
  const currentConversationId = useAppSelector(state => state.chat.currentConversationId);

  if (!conversations.length) {
    return (
      <div className="mt-4 flex flex-col gap-2 p-4 text-center text-sm text-muted-foreground">
        <p>এখনও কোনও চ্যাট ইতিহাস নেই।</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full flex-1 px-2">
      <SidebarMenu className="py-4">
        {conversations.map((conversation) => (
          <SidebarMenuItem key={conversation.id}>
            <SidebarMenuButton
              isActive={currentConversationId === conversation.id}
              onClick={() => dispatch(setCurrentConversationId(conversation.id))}
              tooltip={conversation.title}
            >
              <MessageSquare />
              <span>{conversation.title}</span>
            </SidebarMenuButton>
            <SidebarMenuAction
              aria-label="Delete conversation"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(clearConversation(conversation.id));
              }}
              showOnHover
            >
              <Trash2 />
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </ScrollArea>
  );
}
