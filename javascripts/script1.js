function previewImage(event) {
    const imagePreview = document.getElementById("imagePreview");
    const file = event.target.files[0];

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
        imagePreview.innerHTML = "";
    }
}

function clearImage() {
    document.getElementById("imageUpload").value = "";
    document.getElementById("imagePreview").innerHTML = "";
    document.getElementById("results").innerHTML = "";
}

async function UploadImg() {
    const fileInput = document.getElementById("imageUpload");
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "";

    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Please select an image before clicking upload!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("output_type", "cutout");
    formData.append("bg_blur", "0");
    formData.append("scale", "fit");
    formData.append("auto_center", "false");
    formData.append("stroke_size", "0");
    formData.append("stroke_color", "FFFFFF");
    formData.append("stroke_opacity", "100");
    formData.append("shadow", "disabled");
    formData.append("shadow_opacity", "20");
    formData.append("shadow_blur", "50");
    formData.append("format", "PNG");

    try {
        resultsDiv.innerHTML = "<p>Uploading and processing your image...</p>";

        const response = await fetch("https://api.picsart.io/tools/1.0/removebg", {
            method: "POST",
            headers: {
                accept: "application/json",
                "X-Picsart-API-Key": "eyJraWQiOiI5NzIxYmUzNi1iMjcwLTQ5ZDUtOTc1Ni05ZDU5N2M4NmIwNTEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhdXRoLXNlcnZpY2UtMGUyZWY4ZDUtN2UxZC00YjkxLTg5ODMtZjQwM2Q5YjEyMDYwIiwiYXVkIjoiMjE2MjE3NjIyMDAyMTAyIiwibmJmIjoxNzQwNjA2NDQwLCJzY29wZSI6WyJiMmItYXBpLmdlbl9haSIsImIyYi1hcGkuaW1hZ2VfYXBpIl0sImlzcyI6Imh0dHBzOi8vYXBpLnBpY3NhcnQuY29tL3Rva2VuLXNlcnZpY2UiLCJvd25lcklkIjoiMjE2MjE3NjIyMDAyMTAyIiwiaWF0IjoxNzQwNjA2NDM5LCJqdGkiOiIyYTg0NDhlNS0xOTVlLTQyOTMtOWMwOC01NzYzNWE4ZjY2ODUifQ.igX-Jh7R8qmwxfxOgDuZVBX6wTCib7jh-I3-stdhUKz5pcNlw0AT7DHJARln5ye_0xGUgqu9DBdkwREYzb-FVL9GKtDVQKfknHjAwhuUETS5zfur04LiYZQDFodrUDTaC2V_UJkmgpBnl1gpvN8ZQElS2H1cJOoQWXbHHimpKxcsM2xMs5YuwQV-qSd6WD2DukUk-pLek-zxo0CjP8_PJOVfp5Y_jIBgffSujqzHLfO-sHArEmXPMGU3Ci1WwePvq99ecl60y9u-GGkeoUS-vayHc-W8f5UY5wRRu0KaaFnmDo04X9WCGtqKCWl2WnFRZ-6-J9s6FD7ogH5DkSqxdg"
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        if (result.data && result.data.url) {
            resultsDiv.innerHTML = `
                <img src="${result.data.url}" alt="Processed Image" style="max-width: 100%; border-radius: 8px;">
                <div style="margin-top: 1rem;">
                    <a href="${result.data.url}" download="processed_image.png" style="padding: 0.5rem 1rem; border: none; background-color: #4CAF50; color: white; border-radius: 5px; cursor: pointer; text-decoration: none;">Download</a>
                </div>
            `;
        } else {
            throw new Error("Invalid response from API");
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        resultsDiv.innerHTML = `<p style="color: red;">Failed to process the image. Please try again later.</p>`;
    }
}
