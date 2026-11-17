# Security Specification — NARATHA Portfolio

## 1. Data Invariants
1. **Public Read-Only Portfolio**: Unauthenticated and non-admin visitors may read `projects`, `poems`, and `settings/init` status, but MUST NEVER create, update, or delete any document.
2. **Strict Admin Authority**: Only the verified admin (`naraakarya@gmail.com` with `email_verified == true` or an entry in `/admins/{uid}`) can create, update, or delete documents in `projects`, `poems`, or `settings`.
3. **Immutable Ownership & Creation Timestamps**: `ownerUid` and `createdAt` must match `request.auth.uid` and `request.time` on creation, and cannot be mutated on updates.
4. **Strict Schema & Bounds**: No ghost/shadow fields allowed (`hasOnly`). Every string and array has bounded `.size()` checks (including `imageUrl <= 500000` bytes).
5. **PII Isolation**: `/admins/{userId}` stores email PII and is strictly restricted to the matching verified user (`get` only, no `list`, no client writes).

## 2. The "Dirty Dozen" Attack Payloads (All Expected: PERMISSION_DENIED)
1. **Unauthenticated Project Create**: Anonymous user attempts `setDoc(/projects/p1, ...)`.
2. **Non-Admin Signed-In Project Create**: Regular Google user (`other@gmail.com`) attempts `setDoc(/projects/p2, ...)`.
3. **Unverified Admin Email Spoof**: User token with `email == 'naraakarya@gmail.com'` and `email_verified == false` attempts write.
4. **Shadow Field Injection on Project**: Admin attempts create with extra `{ isVerified: true }`.
5. **OwnerUid Spoofing**: Admin attempts create with `ownerUid: 'someone_else'`.
6. **ID Poisoning**: Admin attempts create with `projectId` > 128 chars or containing invalid symbols (`../etc`).
7. **Oversized Image Payload**: Admin attempts write with `imageUrl` > 500,000 chars.
8. **Invalid Category Enum**: Admin attempts project write with `category: 'Hack'`.
9. **Empty or Unbounded Deliverables Array**: Admin attempts write with `deliverables: []` or > 12 items.
10. **Immutable `createdAt` Tampering on Update**: Admin attempts update changing `createdAt`.
11. **Public Delete Attempt**: Visitor attempts `deleteDoc(/poems/poem-1)`.
12. **Admin Collection Escalation / PII Scrape**: Signed-in non-admin attempts `setDoc(/admins/uid, { role: 'admin' })` or `getDocs(/admins)`.
