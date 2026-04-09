import type { PlasmoMessaging } from "@plasmohq/messaging"

const STORAGE_KEY = "calendarito_session"
const APP_DOMAIN = "calendarito.com"

async function readSessionFromCookies() {
  try {
    // Use domain (not url) to get all cookies including HttpOnly
    const allCookies = await chrome.cookies.getAll({ domain: APP_DOMAIN })

    console.log(
      "[calendarito-bg] All cookies for domain:",
      allCookies.map((c) => ({
        name: c.name,
        httpOnly: c.httpOnly,
        secure: c.secure,
        value: c.value.slice(0, 30) + "…"
      }))
    )

    const tokenCookies = allCookies
      .filter((c) => c.name.includes("-auth-token"))
      .sort((a, b) => a.name.localeCompare(b.name))

    if (tokenCookies.length === 0) {
      console.log("[calendarito-bg] No auth-token cookies found")
      return null
    }

    const raw = tokenCookies
      .map((c) => decodeURIComponent(c.value))
      .join("")

    const session = JSON.parse(raw)
    if (!session?.access_token) return null

    console.log("[calendarito-bg] Session found! User:", session.user?.email)
    return session
  } catch (e) {
    console.error("[calendarito-bg] Error reading cookies:", e)
    return null
  }
}

// Listen for message from content script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_SESSION_FROM_COOKIES") {
    readSessionFromCookies().then((session) => {
      if (session) {
        chrome.storage.local.set({ [STORAGE_KEY]: session })
        console.log("[calendarito-bg] Session stored in chrome.storage.local")
      } else {
        chrome.storage.local.remove(STORAGE_KEY)
      }
      sendResponse({ session })
    })
    return true // keep channel open for async response
  }
})

// Open side panel on icon click
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) chrome.sidePanel.open({ tabId: tab.id })
})

// Also run on startup in case the side panel is opened before visiting calendarito.com
chrome.runtime.onInstalled.addListener(() => {
  readSessionFromCookies().then((session) => {
    if (session) {
      chrome.storage.local.set({ [STORAGE_KEY]: session })
    }
  })
})
