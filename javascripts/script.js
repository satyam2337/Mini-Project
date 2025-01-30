async function generateImage() {
  const prompt = document.getElementById('prompt').value;

  // Create a card with a loading animation and text
  const results = document.getElementById('results');
  const card = document.createElement('div');
  card.className = 'card';

  const loader = document.createElement('div');
  loader.className = 'loader';

  const cardText = document.createElement('div');
  cardText.className = 'card-text';
  cardText.textContent = 'Generating image...';

  card.appendChild(loader);
  card.appendChild(cardText);
  results.appendChild(card);

  const response = await fetch(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    {
      headers: {
        Authorization: "Bearer apikey",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (response.ok) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    displayImage(url, prompt, card);
  } else {
    console.error('Image generation failed', response.statusText);
  }
}




function displayImage(url, prompt, card) {
  const loader = card.querySelector('.loader');
  card.removeChild(loader);

  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Generated Image';
  img.style.width = '400px';
  img.style.height = '400px';

  const cardText = card.querySelector('.card-text');
  cardText.textContent = prompt;

  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'download-btn';
  downloadBtn.textContent = 'Download';
  downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  card.insertBefore(img, cardText);
  card.appendChild(downloadBtn);
}

function clearResults() {
  document.getElementById('results').innerHTML = '';
  document.getElementById('prompt').value = '';
}

function generateRandomText() {
  const randomTexts = [
    'A serene sunset over the mountains',
    'A futuristic cityscape at night',
    'A dragon flying over a medieval castle',
    'A whimsical forest with magical creatures',
    'A spaceship exploring a distant planet'
  ];
  const randomIndex = Math.floor(Math.random() * randomTexts.length);
  document.getElementById('prompt').value = randomTexts[randomIndex];
}
