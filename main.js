const formEl = document.querySelector(".form");
const output = document.getElementById("shape");
const img = document.getElementById("lookalike_img");
const fileInput = document.querySelector(".file");
const dropArea = document.getElementById("drop-area");
const searchBtn = document.querySelector(".btn");

// Funny loading texts for animation
const funnyLoadingTexts = [
  "no be gadus be this...",
  "yeee see spec..",
  "drop dead gorgeous, period!!...",
  "sope purr...",
  "you've got beautiful eyes...",
  "I'd ask you out if I wasn't an AI...",
  "creator thinks you look great ;)...",
];

// Image preview functionality
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
      img.style.display = "block";
      dropArea.style.backgroundImage = `url(${event.target.result})`;
      dropArea.style.backgroundSize = "cover";
      dropArea.style.backgroundPosition = "center";
      dropArea.innerHTML = ""; // Clear default content
    };
    reader.readAsDataURL(file);
  }
});

// Drag and drop functionality
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("drag-over");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("drag-over");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("drag-over");

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    fileInput.files = e.dataTransfer.files;
    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
      img.style.display = "block";
      dropArea.style.backgroundImage = `url(${event.target.result})`;
      dropArea.style.backgroundSize = "cover";
      dropArea.style.backgroundPosition = "center";
      dropArea.innerHTML = ""; // Clear default content
    };
    reader.readAsDataURL(file);
  }
});

formEl.addEventListener("submit", (event) => {
  event.preventDefault();

  // Check if file is selected
  if (fileInput.files.length === 0) {
    output.textContent = "No file selected!";
    return;
  }

  // Add loading state
  searchBtn.disabled = true;
  searchBtn.querySelector("p").textContent = "Searching...";
  output.textContent = getRandomLoadingText();

  // Cycle through loading texts
  const loadingInterval = setInterval(() => {
    output.textContent = getRandomLoadingText();
  }, 2000);

  const imageFile = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", imageFile);

  fetch("https://bamswastaken-lookalike.hf.space/lookalike", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("A problem occurred");
      }
      return response.json();
    })
    .then((data) => {
      // Clear loading interval
      clearInterval(loadingInterval);

      // Reset button and output
      searchBtn.disabled = false;
      searchBtn.querySelector("p").textContent = "Search";

      // Display result
      img.src = data;
      img.style.display = "block";
      dropArea.style.backgroundImage = `url(${data})`;
      dropArea.style.backgroundSize = "cover";
      dropArea.style.backgroundPosition = "center";
      dropArea.innerHTML = ""; // Clear any text

      output.textContent = "Found your lookalike!";
    })
    .catch((error) => {
      // Clear loading interval
      clearInterval(loadingInterval);

      // Reset button
      searchBtn.disabled = false;
      searchBtn.querySelector("p").textContent = "Search";

      console.log(error);
      output.textContent = "Oops! Something went wrong.";
    });
});

// Helper function to get random loading text
function getRandomLoadingText() {
  return funnyLoadingTexts[
    Math.floor(Math.random() * funnyLoadingTexts.length)
  ];
}

// Optional: Style for drag over
const style = document.createElement("style");
style.textContent = `
    .drag-over {
        border: 2px solid #007bff !important;
        background-color: rgba(0, 123, 255, 0.1) !important;
    }
`;
document.head.appendChild(style);
