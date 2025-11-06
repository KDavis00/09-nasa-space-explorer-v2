const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');
const getImageBtn = document.getElementById('getImageBtn');

const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeBtn');
const modalMedia = document.getElementById('modal-media');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalExplanation = document.getElementById('modal-explanation');

getImageBtn.addEventListener('click', fetchAPOD);

async function fetchAPOD() {
  loading.textContent = 'Loading space images...';
  gallery.innerHTML = '';

  try {
    const response = await fetch(apodData);
    const data = await response.json();

    const items = data.slice(0, 9);
    loading.style.display = 'none';

    items.forEach(photo => {
      const card = document.createElement('div');
      card.className = 'photo-card';

      // Handle image or video
      if(photo.media_type === 'image') {
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.title;
        card.appendChild(img);
      } else if(photo.media_type === 'video') {
        const img = document.createElement('img');
        img.src = photo.thumbnail_url || '';
        img.alt = photo.title;
        card.appendChild(img);
      }

      // Title and date
      const title = document.createElement('h3');
      title.textContent = photo.title;
      card.appendChild(title);

      const date = document.createElement('p');
      date.textContent = photo.date;
      card.appendChild(date);

      // Click to open modal
      card.addEventListener('click', () => openModal(photo));

      gallery.appendChild(card);
    });

  } catch (error) {
    loading.textContent = 'Failed to load APOD data.';
    console.error(error);
  }
}

// Modal functions
function openModal(photo) {
  modal.style.display = 'block';
  modalMedia.innerHTML = '';

  if(photo.media_type === 'image') {
    const img = document.createElement('img');
    img.src = photo.hdurl || photo.url;
    img.alt = photo.title;
    modalMedia.appendChild(img);
  } else if(photo.media_type === 'video') {
    const iframe = document.createElement('iframe');
    iframe.src = photo.url;
    iframe.frameBorder = 0;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    modalMedia.appendChild(iframe);
  }

  modalTitle.textContent = photo.title;
  modalDate.textContent = photo.date;
  modalExplanation.textContent = photo.explanation;
}

closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none'; });

// Get references to DOM elements
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

// NASA APOD API key (use 'DEMO_KEY' for demo purposes)
const API_KEY = 'DEMO_KEY';

// Function to fetch images for a date range
const fetchImages = async (startDate, endDate) => {
  // Show loading message
  loading.textContent = 'Loading images...';
  gallery.innerHTML = '';

  // Build API URL with date range
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  try {
    // Fetch data from NASA API
    const response = await fetch(url);
    const data = await response.json();

    // Check if data is an array (multiple images)
    if (Array.isArray(data)) {
      // Display each image in the gallery
      data.forEach(item => {
        // Only show images (not videos)
        if (item.media_type === 'image') {
          const imgDiv = document.createElement('div');
          imgDiv.className = 'gallery-item';
          imgDiv.innerHTML = `
            <img src="${item.url}" alt="${item.title}" />
            <p>${item.title}</p>
            <p>${item.date}</p>
          `;
          gallery.appendChild(imgDiv);

          // Add click event to show modal with details
          imgDiv.addEventListener('click', () => showModal(item));
        }
      });
      loading.textContent = '';
    } else {
      // If only one image is returned
      loading.textContent = 'No images found for this range.';
    }
  } catch (error) {
    loading.textContent = 'Error fetching images.';
    console.error(error);
  }
};

// Function to show modal with image details
const showModal = (item) => {
  const modal = document.getElementById('modal');
  const modalMedia = document.getElementById('modal-media');
  const modalTitle = document.getElementById('modal-title');
  const modalDate = document.getElementById('modal-date');
  const modalExplanation = document.getElementById('modal-explanation');

  // Set modal content
  modalMedia.innerHTML = `<img src="${item.url}" alt="${item.title}" />`;
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation;

  // Show modal
  modal.style.display = 'block';
};

// Close modal when user clicks the close button
document.getElementById('closeBtn').onclick = function() {
  document.getElementById('modal').style.display = 'none';
};

// Fetch images when button is clicked
getImageBtn.addEventListener('click', () => {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  // Check if both dates are selected
  if (!startDate || !endDate) {
    loading.textContent = 'Please select both start and end dates.';
    return;
  }

  // Fetch images for the selected date range
  fetchImages(startDate, endDate);
});

// Create a "Surprise Me" button and add it to the filters section
const filtersDiv = document.querySelector('.filters');
const surpriseBtn = document.createElement('button');
surpriseBtn.id = 'surpriseBtn';
surpriseBtn.textContent = 'Surprise Me';
filtersDiv.appendChild(surpriseBtn);

// When "Surprise Me" is clicked, show a random image from the local APOD data
surpriseBtn.addEventListener('click', async () => {
  loading.textContent = 'Loading a surprise image...';
  gallery.innerHTML = '';

  try {
    // Fetch the local APOD data
    const response = await fetch(apodData);
    const data = await response.json();

    // Pick a random photo from the data
    const randomIndex = Math.floor(Math.random() * data.length);
    const photo = data[randomIndex];

    // Create a card for the random photo
    const card = document.createElement('div');
    card.className = 'photo-card';

    // Handle image or video
    if (photo.media_type === 'image') {
      const img = document.createElement('img');
      img.src = photo.url;
      img.alt = photo.title;
      card.appendChild(img);
    } else if (photo.media_type === 'video') {
      const img = document.createElement('img');
      img.src = photo.thumbnail_url || '';
      img.alt = photo.title;
      card.appendChild(img);
    }

    // Title and date
    const title = document.createElement('h3');
    title.textContent = photo.title;
    card.appendChild(title);

    const date = document.createElement('p');
    date.textContent = photo.date;
    card.appendChild(date);

    // Click to open modal
    card.addEventListener('click', () => openModal(photo));

    gallery.appendChild(card);
    loading.style.display = 'none';
  } catch (error) {
    loading.textContent = 'Failed to load surprise image.';
    console.error(error);
  }
});