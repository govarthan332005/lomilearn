// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGP9EXBU1HOK9Hm5q5SetXYqG2DjRdBr4",
  authDomain: "realtimedatabase-98181.firebaseapp.com",
  databaseURL: "https://realtimedatabase-98181-default-rtdb.firebaseio.com",
  projectId: "realtimedatabase-98181",
  storageBucket: "realtimedatabase-98181.appspot.com",
  messagingSenderId: "169892823409",
  appId: "1:169892823409:web:0a8052a7a1d57c4c4676d0",
  measurementId: "G-F8RVHR3C6Q",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Function to fetch and play video
function fetchAndPlayVideo() {
  const videoElement = document.getElementById("video");
  const descriptionElement = document.getElementById("description");

  // Show loading state
  descriptionElement.textContent = "Loading today's video...";
  
  db.collection("videos")
    .limit(1) // Fetch a single video
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        const videoUrl = data.url;
        const description = data.description || "Enjoy this video!";

        if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
          // Handle YouTube URLs by showing a message
          descriptionElement.textContent = "This video is hosted on YouTube. Please watch it on YouTube.";
          videoElement.outerHTML = `<p>YouTube video links are not supported in this player.</p>`;
        } else {
          // Handle videos stored on Firebase Storage
          storage
            .ref(videoUrl)
            .getDownloadURL()
            .then((downloadURL) => {
              // Set video source and description
              videoElement.src = downloadURL;
              descriptionElement.textContent = description;
            })
            .catch((error) => {
              console.error("Error fetching video URL:", error);
              descriptionElement.textContent = "Error loading today's video.";
            });
        }
      } else {
        descriptionElement.textContent = "No videos available for today.";
      }
    })
    .catch((error) => {
      console.error("Error fetching video:", error);
      descriptionElement.textContent = "Error loading today's video.";
    });
}

// Load video when the DOM is ready
window.addEventListener("DOMContentLoaded", fetchAndPlayVideo);





const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const stickyPoint = 100; // Scroll threshold for sticky header

// Toggle sidebar on menu button click
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  // Close nav toggler after scrolling to destination
  document.addEventListener('scroll', closeNavToggler);
});

// Function to close nav toggler
function closeNavToggler() {
  sidebar.classList.remove('active');
  // Remove event listener to prevent multiple closures
  document.removeEventListener('scroll', closeNavToggler);
}

// Sample PDF data with direct download links
const pdfData = {
  class10: {
    math: [
      { title: "Algebra Basics.pdf", link: "https://drive.google.com/uc?export=download&id=1R16R42V7_92EAxS4iwR3tey63gYtHPOY" },
      { title: "Geometry Essentials.pdf", link: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_2" }
    ],
    science: [
      { title: "Physics Fundamentals.pdf", link: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_3" },
      { title: "Chemistry Basics.pdf", link: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_4" }
    ]
  },
  class12: {
    math: [
      { title: "Calculus Intro.pdf", link: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_5" },
      { title: "Advanced Geometry.pdf", link: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_6" }
    ],
    science: [
      { title: "Biology Overview.pdf", link: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_7" },
      { title: "Physics Advanced.pdf", link: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_8" }
    ]
  }
};

// Update PDF suggestions based on class and subject selection
function updatePdfSuggestions() {
  const classSelect = document.getElementById("classSelect").value;
  const subjectSelect = document.getElementById("subjectSelect").value;
  const pdfSuggestions = document.getElementById("pdfSuggestions");

  pdfSuggestions.innerHTML = ""; // Clear current suggestions

  if (classSelect && subjectSelect && pdfData[classSelect] && pdfData[classSelect][subjectSelect]) {
    const selectedPdfs = pdfData[classSelect][subjectSelect];
    selectedPdfs.forEach((pdf) => {
      const pdfItem = document.createElement("div");
      pdfItem.classList.add("pdf-item");

      // Create link for each PDF
      const pdfLink = document.createElement("a");
      pdfLink.href = pdf.link;
      pdfLink.textContent = pdf.title;
      pdfLink.target = "_blank"; // Opens in a new tab
      pdfLink.classList.add("pdf-link");

      pdfItem.appendChild(pdfLink);
      pdfSuggestions.appendChild(pdfItem);
    });
  } else {
    pdfSuggestions.innerHTML = "<p>Select a class and subject to view available PDFs.</p>";
  }
}
const Pdfs = document.getElementById("pdfs");
const hub = document.getElementById("hub");
function downloadpdfs(){
   hub.style.display="none";
   pdfs.style.display="block";
}
function video(){
  pdfs.style.display="none";
  hub.style.display="block";
}



