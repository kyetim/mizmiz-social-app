-- Messaging System Tables for Supabase
-- Run this in Supabase SQL Editor if prisma db push fails

-- Conversations table
CREATE TABLE IF NOT EXISTS "conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user1Id" UUID NOT NULL,
    "user2Id" UUID NOT NULL,
    "lastMessageId" UUID,
    "lastMessageAt" TIMESTAMP(3),
    "user1UnreadCount" INTEGER NOT NULL DEFAULT 0,
    "user2UnreadCount" INTEGER NOT NULL DEFAULT 0,
    "user1CanMessage" BOOLEAN NOT NULL DEFAULT true,
    "user2CanMessage" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- Messages table
CREATE TABLE IF NOT EXISTS "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversationId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "content" VARCHAR(2000) NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "conversations" 
    ADD CONSTRAINT "conversations_user1Id_fkey" 
    FOREIGN KEY ("user1Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "conversations" 
    ADD CONSTRAINT "conversations_user2Id_fkey" 
    FOREIGN KEY ("user2Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "messages" 
    ADD CONSTRAINT "messages_conversationId_fkey" 
    FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "messages" 
    ADD CONSTRAINT "messages_senderId_fkey" 
    FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "conversations_user1Id_user2Id_key" ON "conversations"("user1Id", "user2Id");
CREATE INDEX IF NOT EXISTS "conversations_user1Id_idx" ON "conversations"("user1Id");
CREATE INDEX IF NOT EXISTS "conversations_user2Id_idx" ON "conversations"("user2Id");
CREATE INDEX IF NOT EXISTS "conversations_lastMessageAt_idx" ON "conversations"("lastMessageAt");
CREATE INDEX IF NOT EXISTS "messages_conversationId_idx" ON "messages"("conversationId");
CREATE INDEX IF NOT EXISTS "messages_senderId_idx" ON "messages"("senderId");
CREATE INDEX IF NOT EXISTS "messages_createdAt_idx" ON "messages"("createdAt");

