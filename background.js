chrome.commands.onCommand.addListener((command) => {
    console.log("Command received:", command)
  
    if (command === "copy-lyrics") {
      // Changed from copy-lyrics-shortcut
      console.log("Keyboard shortcut triggered: Copy Lyrics")
  
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) {
          console.error("No active tab found.")
          return
        }
  
        const activeTab = tabs[0]
        console.log("Active tab:", activeTab)
  
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTab.id },
            func: copyLyrics,
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error("Error executing script:", chrome.runtime.lastError.message)
            } else {
              console.log("Script executed successfully!")
            }
          },
        )
      })
    } else if (command === "open-search") {
      // Changed from open-search-popup
      chrome.action.openPopup()
    }
  })
  
  function copyLyrics() {
    console.log("Executing copyLyrics function in the active tab...")
  
    const titleElement = document.querySelector(".post-title.entry-title")
    const contentElement = document.querySelector(".entry-content.gridread-clearfix")
  
    if (!titleElement || !contentElement) {
      console.error("Title or content element not found.")
      return
    }
  
    const title = titleElement.textContent.trim()
    const content = contentElement.innerText.trim()
    const textToCopy = `${title}\n\n${content}`
  
    console.log("Text to copy:\n", textToCopy)
  
    const textarea = document.createElement("textarea")
    textarea.value = textToCopy
    document.body.appendChild(textarea)
    textarea.select()
  
    try {
      document.execCommand("copy")
      console.log("Text successfully copied to clipboard!")
    } catch (err) {
      console.error("execCommand failed:", err)
    } finally {
      document.body.removeChild(textarea)
    }
  }
  
  