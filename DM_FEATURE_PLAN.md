# DMs / Private Messaging — Feature Plan

## Context
Direct messaging between friends. The app has no Realtime subscriptions yet — all data uses TanStack Query with staleTime/polling. DMs would be the first feature to introduce Supabase Realtime. Friends-only, text-only for V1.

## Key Design Decisions

1. **Navigation**: Segmented control inside existing Inbox tab (`[Notifications | Messages]`) — no new tab
2. **Realtime**: Supabase Realtime channels for in-chat message delivery; polling for conversation list + unread badge
3. **Schema**: `conversations` table (canonical `user_a < user_b`) + `messages` table + `conversation_read_cursors` table
4. **V1 scope**: Text-only, no media. Read receipts via cursor table (not real-time). Friends-only enforced in RPC.

---

## Database — Migration 049

### Tables

**`conversations`** — one row per friend pair, created on first message
- `id`, `user_a`, `user_b` (CHECK `user_a < user_b`, UNIQUE)
- `last_message_at`, `last_message_preview`, `last_message_sender_id`
- Indexes on `(user_a, last_message_at DESC)` and `(user_b, last_message_at DESC)`

**`messages`** — all messages
- `id`, `conversation_id` (FK), `sender_id` (FK), `body` (1–1000 chars), `is_deleted`, `created_at`
- Index on `(conversation_id, created_at DESC)`

**`conversation_read_cursors`** — per-user read tracking
- PK `(user_id, conversation_id)`, `last_read_at`

### RPCs

| RPC | Purpose |
|-----|---------|
| `send_message(p_recipient_id, p_body)` | Enforces friendship + block check, creates conversation if needed, inserts message, updates conversation preview, returns message_id + conversation_id |
| `get_conversations(p_limit, p_offset)` | Returns conversation list with other user info, last message, unread flag |
| `get_messages(p_conversation_id, p_limit, p_before)` | Paginated messages (cursor-based, newest first) |
| `mark_conversation_read(p_conversation_id)` | Upserts read cursor |
| `get_unread_dm_count()` | Count of conversations with unread messages (for badge) |
| `delete_message(p_message_id)` | Soft-delete own messages |

### Trigger
- `AFTER INSERT ON messages` → inserts notification with `type = 'dm'` + `conversation_id` → triggers existing `send-push` webhook

### RLS
- Conversations: users see only their own (`auth.uid() = user_a OR auth.uid() = user_b`)
- Messages: users see messages in their own conversations
- Messages: users insert only as sender (`sender_id = auth.uid()`)
- Read cursors: users manage only their own

### Other migration changes
- Add `conversation_id uuid` column to `notifications` table
- Add `'dm'` to notifications type CHECK constraint
- `ALTER PUBLICATION supabase_realtime ADD TABLE messages`

---

## New Files

### Hooks (7 total)
| Hook | Pattern | Notes |
|------|---------|-------|
| `hooks/useConversations.ts` | `useInfiniteQuery` | `get_conversations` RPC, 20/page, staleTime 10s, refetchInterval 10s |
| `hooks/useMessages.ts` | `useInfiniteQuery` | `get_messages` RPC, 30/page, cursor-based (p_before), staleTime Infinity (realtime handles freshness) |
| `hooks/useSendMessage.ts` | `useMutation` | `moderateText()` before RPC, optimistic append to messages cache, invalidates conversations on settled |
| `hooks/useDeleteMessage.ts` | `useMutation` | Soft-delete, optimistic update in cache |
| `hooks/useMarkConversationRead.ts` | `useMutation` | Invalidates conversations + unreadDmCount |
| `hooks/useUnreadDmCount.ts` | `useQuery` | refetchInterval 30s (matches useUnreadShareCount pattern) |
| `hooks/useMessageRealtime.ts` | Supabase Realtime | Subscribe to `messages` INSERT/UPDATE filtered by conversation_id |

### Components (3 total)
| Component | Description |
|-----------|-------------|
| `components/ConversationRow.tsx` | Avatar, username, message preview, timestamp, unread blue dot |
| `components/MessageBubble.tsx` | Sent = right-aligned flame bg, received = left-aligned surface bg, timestamp, long-press delete for own |
| `components/ChatInput.tsx` | TextInput + Send button, disabled while sending, char counter near 1000 limit |

### Screens (1 total)
| Screen | Description |
|--------|-------------|
| `app/chat/[conversationId].tsx` | Header (back + friend avatar/username), inverted FlatList, ChatInput, KeyboardAvoidingView |

---

## Modified Files

| File | Change |
|------|--------|
| `app/(tabs)/inbox.tsx` | Add segmented control `[Notifications \| Messages]`, render conversation list when Messages selected |
| `app/(tabs)/_layout.tsx` | Combine notification + DM unread counts for inbox badge |
| `app/_layout.tsx` | Register `chat/[conversationId]` screen (presentation: 'card'), add DM push tap routing |
| `app/user/[userId].tsx` | Add "Message" button for accepted friends (friendshipStatus === 'friends') |
| `supabase/functions/send-push/index.ts` | Add `dm` case in getNotificationContent, pass conversationId in push data |
| `hooks/usePushNotifications.ts` | Add `data.conversationId` routing in tap handler |

---

## Realtime Design

First Realtime usage in the app. Minimal footprint:

```
Chat screen mounts
  → supabase.channel(`chat:${conversationId}`)
    .on('postgres_changes', { event: 'INSERT', table: 'messages', filter: conversation_id=eq.X })
  → On new message from other user: prepend to TanStack Query cache (instant display)
  → Skip own messages (already optimistically added)
  → Also listen for UPDATE events (soft-delete)
Chat screen unmounts
  → supabase.removeChannel(channel)
```

Conversation list uses **polling** (refetchInterval 10s), not Realtime — 10s latency is fine for a list.

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| **Unfriended mid-conversation** | `send_message` checks friendship on every send. Historical messages stay visible. New sends blocked with "You are no longer friends" error. |
| **Blocked user** | RPC checks both directions. Conversation list filters out blocked users in SQL. |
| **Push while in chat** | Add `activeConversationId` to Zustand store. Suppress foreground push if user is viewing that conversation. |
| **Empty conversations** | `get_conversations` filters `last_message_at IS NOT NULL` — never shown. |
| **Moderation failure** | `moderateText()` runs client-side before RPC. Message never leaves device if rejected. |
| **Rapid sends** | Optimistic updates with temp UUIDs, replaced by real IDs on success. |

---

## Phased Execution Order

### Phase 1 — Database
1. Write migration 049 (tables, RLS, RPCs, trigger, realtime publication)
2. Update send-push edge function for `dm` type
3. Run migration in Supabase dashboard

### Phase 2 — Hooks
4. Create all 7 hooks

### Phase 3 — UI
5. Create ConversationRow, MessageBubble, ChatInput components
6. Create `app/chat/[conversationId].tsx`
7. Modify inbox.tsx with segmented control
8. Add Message button to user profile
9. Register routes in _layout.tsx

### Phase 4 — Push + Polish
10. Update push tap handler for DM routing
11. Add active conversation suppression
12. Update inbox badge to combine counts
13. Empty states, loading skeletons, haptics

---

## Verification Checklist
- [ ] Friend A sends message to Friend B → message appears in B's chat via Realtime
- [ ] B opens conversation list → shows conversation with unread dot
- [ ] B opens chat → read cursor updates → A's conversation list shows "read"
- [ ] Unfriend → try to send → error message shown
- [ ] Block → conversation disappears from list
- [ ] Push notification tapped → navigates to correct chat
- [ ] Long-press own message → delete → shows "Message deleted"
- [ ] Scroll up in chat → loads older messages (pagination)
- [ ] 1000 char limit enforced in input
- [ ] Text moderation blocks inappropriate messages before send
