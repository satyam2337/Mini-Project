function previewImage(event) {
    const imagePreview = document.getElementById("imagePreview");
    const file = event.target.files[0];
    const clearButton = document.createElement("button");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.innerHTML = `
                <img src="${e.target.result}" alt="Preview" style="max-width: 100%; border-radius: 8px;">
                <div style="margin-top: 1rem;">
                    <button id="clearButton" onclick="clearImage()" style="padding: 0.5rem 1rem; border: none; background-color: #f44336; color: white; border-radius: 5px; cursor: pointer;">
                        Clear
                    </button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = ""; // Clear preview if no file is selected
    }
}

function clearImage() {
    const imageUpload = document.getElementById("imageUpload");
    const imagePreview = document.getElementById("imagePreview");

    // Clear the file input and preview
    imageUpload.value = "";
    imagePreview.innerHTML = "";
}





async function UploadImg() {
    const fileInput = document.getElementById("imageUpload");
    const resultsDiv = document.getElementById("results");
    const imagePreview = document.getElementById("imagePreview");

    // Clear previous results
    resultsDiv.innerHTML = "";

    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Please select an image before clicking upload!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
        // Show loading message
        resultsDiv.innerHTML = "<p>Uploading and processing your image...</p>";

        // Call the Hugging Face API
        const response = await fetch("https://api-inference.huggingface.co/models/YOUR_MODEL_NAME", {
            method: "POST",
            headers: {
                Authorization: "Bearer YOUR_HUGGING_FACE_API_KEY",
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API returned an error: ${response.status}`);
        }

        const resultBlob = await response.blob();
        const resultUrl = URL.createObjectURL(resultBlob);

        // Display the processed image
        resultsDiv.innerHTML = `<img src="${resultUrl}" alt="Processed Image" style="max-width: 100%; border-radius: 8px;">`;

    } catch (error) {
        console.error("Error uploading image:", error);
        resultsDiv.innerHTML = `<p style="color: red;">Failed to process the image. Please try again later.</p>`;
    }
}
