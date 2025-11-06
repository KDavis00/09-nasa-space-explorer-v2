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