document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("imageInput");
  const statusDiv = document.getElementById("status");

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      console.log("Uploading image...");
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log(result);

      if (statusDiv) {
        statusDiv.innerHTML = `✅ Success! Image split into ${result.pieces} pieces.`;
      }
    } catch (err) {
      console.error(err);
      if (statusDiv) {
        statusDiv.innerHTML = "❌ Error uploading/splitting image.";
      }
    }
    
    // Refresh the page/
    window.location.reload();
  });
});
