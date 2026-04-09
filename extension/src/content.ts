import type { PlasmoCSConfig } from "plasmo"

/**
 * Content script that runs on calendarito.com.
 * Reads the Supabase session from cookies and stores it
 * in chrome.storage.local so the side panel can access it.
 */
export const config: PlasmoCSConfig = {
  matches: ["https://calendarito.com/*"],
  run_at: "document_idle"
}

const STORAGE_KEY = "calendarito_session"

function readSession(): object | null {
  const cookies = document.cookie.split(";")
  const tokenParts: { name: string; value: string }[] = []

  for (const cookie of cookies) {
    const [rawName, ...rest] = cookie.trim().split("=")
    const name = rawName.trim()
    const value = rest.join("=").trim()
    if (name.includes("-auth-token")) {
      tokenParts.push({ name, value })
    }
  }

  if (tokenParts.length > 0) {
    // Sort to handle chunked cookies (.0, .1, etc.)
    tokenParts.sort((a, b) => a.name.localeCompare(b.name))
    const raw = tokenParts.map((p) => decodeURIComponent(p.value)).join("")

    try {
      // Supabase SSR encodes cookie values as "base64-<b64>" — decode if present
      const jsonStr = raw.startsWith("base64-") ? atob(raw.slice(7)) : raw
      const parsed = JSON.parse(jsonStr)
      if (parsed?.access_token) {
        console.log("[calendarito-ext] Session found in cookies")
        return parsed
      }
    } catch (e) {
      console.error("[calendarito-ext] Failed to parse cookie session:", e)
    }
  }

  return null
}

async function syncSession() {
  const session = readSession()

  if (session) {
    await chrome.storage.local.set({ [STORAGE_KEY]: session })
    console.log("[calendarito-ext] Session synced to storage ✓")
  } else {
    await chrome.storage.local.remove(STORAGE_KEY)
    console.log("[calendarito-ext] No session found, storage cleared")
  }
}

// Sync on load
syncSession()

// Re-sync when URL changes (SPA navigation)
let lastUrl = location.href
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href
    syncSession()
  }
}).observe(document.body, { subtree: true, childList: true })
