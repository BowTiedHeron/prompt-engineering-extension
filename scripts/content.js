// // Declare new function
// const insert = (content) => {
//   // Find Calmly editor input section
//   const elements = document.getElementsByClassName(
//     "notranslate public-DraftEditor-content"
//   );

//   if (elements.length === 3) {
//     return;
//   }

//   const element = elements[0];

//   // Grab the first p tag so we can replace it with our injection
//   const dataToRemove = element.childNodes[0];
//   dataToRemove.remove();

//   // Split content by \n
//   const splitContent = content.split("\n");

//   // Wrap in p tags
//   splitContent.forEach((content) => {
//     const span = document.createElement("span");

//     if (content === "") {
//       const br = document.createElement("br");
//       span.appendChild(br);
//     } else {
//       span.textContent = content;
//     }

//     // Insert into HTML one at a time
//     element.appendChild(p);
//   });

//   // On success return true
//   return true;
// };

chrome.runtime.onMessage.addListener(
  // This is the message listener
  (request, sender, sendResponse) => {
    if (request.message === "inject") {
      const { content } = request;

      // TODO: This is the insert function; I will likely switch this off until I have the right use case.
      //   const result = insert(content);
      console.log(content);

      // // If something went wrong we want to see a failed status
      // if (!result) {
      //   sendResponse({ status: "failed" });
      // }

      sendResponse({ status: "success" });
    }
  }
);
