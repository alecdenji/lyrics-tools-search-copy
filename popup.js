// Function to handle the search
function searchLyrics() {
    const searchText = document.getElementById("search-bar").value.trim()
    if (searchText) {
      const query = searchText.replace(/\s+/g, "+")
      const url = `https://lyrics.mcgi.app/?s=${query}`
      window.open(url, "_blank")
    }
  }
  
  // Function to handle copying lyrics
  function executeCopyLyrics() {
    document.getElementById("status").textContent = "Copying..."
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        console.error("No active tab found.")
        document.getElementById("status").textContent = "Error: No active tab."
        return
      }
  
      const activeTab = tabs[0]
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          func: copyLyrics,
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message)
            document.getElementById("status").textContent = "Error: Cannot copy."
          } else {
            document.getElementById("status").textContent = "Copied to clipboard!"
          }
        },
      )
    })
  }
  
  // Copy lyrics function that will be injected into the page
  function copyLyrics() {
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
  
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        console.log("Text successfully copied to clipboard!")
      },
      (err) => {
        console.error("Could not copy text: ", err)
      },
    )
  }
  
  // Listen for the search button click
  document.getElementById("search-btn").addEventListener("click", searchLyrics)
  
  // Listen for the Enter key in search bar
  document.getElementById("search-bar").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchLyrics()
    }
  })
  
  // Listen for the copy button click
  document.getElementById("copy-lyrics").addEventListener("click", executeCopyLyrics)
  
  