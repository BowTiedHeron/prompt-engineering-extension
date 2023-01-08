// Function to get + decode API key
const getKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["openai-key"], (result) => {
      if (result["openai-key"]) {
        const decodedKey = atob(result["openai-key"]);
        resolve(decodedKey);
      }
    });
  });
};

const sendMessage = (content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    chrome.tabs.sendMessage(
      activeTab,
      { message: "inject", content },
      (response) => {
        if (response.status === "failed") {
          console.log("injection failed.");
        }
      }
    );
  });
};

const generate = async (prompt) => {
  // Get your API key from storage
  const key = await getKey();
  const url = "https://api.openai.com/v1/completions";

  // Call completions endpoint
  const completionResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.8,
    }),
  });

  // Select the top choice and send back
  const completion = await completionResponse.json();
  return completion.choices.pop();
};

const generateCompletionAction = async (info) => {
  try {
    // Send mesage with generating text (this will be like a loading indicator)
    sendMessage("generating...");

    // selected text that will be used to generate the prompt
    const { selectionText } = info;

    // This will be added before the prompt to get the desired outcome
    const basePromptPrefix = `
    Suggest a more effective prompt based on A.I. algorithms. Please also provide insights into why certain prompts may be more effective than others. 

    user prompt:
	`;

    const baseCompletion = await generate(
      `${basePromptPrefix}${selectionText}`
    );
    console.log(baseCompletion.text);

    // Send the output for the first prompt
    sendMessage(baseCompletion.text);

    // Trigger the second prompt here
    const secondPrompt = `
      Suggest a list of five alternative prompts.
      
      Original feedback: ${baseCompletion.text}
      
      List of prompts:
      `;

    // Call your second prompt
    const secondPromptCompletion = await generate(secondPrompt);
    console.log(secondPromptCompletion.text);

    // Send the output for the second prompt
    sendMessage(secondPromptCompletion.text);
  } catch (error) {
    console.log(error);

    // This will let us know if we run into any errors!
    sendMessage(error.toString());
  }
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "context-run",
    title: "Suggest a more effective prompt based on A.I. algorithms.",
    contexts: ["selection"],
  });
});

// Add listener
chrome.contextMenus.onClicked.addListener(generateCompletionAction);
