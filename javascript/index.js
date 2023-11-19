document.addEventListener('DOMContentLoaded', () => {

    const navbarToggle = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
  
    navbarToggle.addEventListener('click', () => {
      navbarCollapse.classList.toggle('show');
    });
  
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991) {
        navbarCollapse.classList.remove('show');
      }
    });
  
    const images = [...allImages];
    const galleryContainer = document.getElementById('imageContainer');
    const pagination = document.querySelector('.pagination');
    const itemsPerPage = 6;
    let currentPage = 1;
    const searchInput = document.getElementById('searchInput');
  
  
    function filterImagesBySearchTerm() {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredImages = allImages.filter(image => image.description.toLowerCase().includes(searchTerm));
      currentPage = 1;
      images.length = 0;
      images.push(...filteredImages);
      updatePagination();
      updateGallery();
    }
    
    searchInput.addEventListener('input', () => {
      filterImagesBySearchTerm();
    });
    
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default form submission behavior
        filterImagesBySearchTerm();
        searchInput.value='';
      }
    });
  
    document.querySelector('.searchButton').addEventListener('click', () => {
      console.log('Button clicked');
      const searchTerm = document.getElementById('searchInput').value.toLowerCase();
      filterImagesBySearchTerm(searchTerm);
      searchInput.value ='';
    });
  
  
    function updateGallery() {
      if (isNaN(currentPage) || currentPage < 1) {
        console.error("Invalid currentPage:", currentPage);
        return;
    }
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    // Ensure startIndex and endIndex are valid numbers
    if (isNaN(startIndex) || isNaN(endIndex)) {
        console.error("Invalid startIndex or endIndex:", startIndex, endIndex);
        return;
    }
      
      // Ensure startIndex is within the valid range
      const startClamped = Math.min(startIndex, images.length);
      const endClamped = Math.min(endIndex, images.length);
  
      const visibleImages = images.slice(startClamped, endClamped);
  
      galleryContainer.innerHTML = visibleImages.map((imageData, index) => `
        <div class="col" id="image${startIndex + index}">
          <div class="card bg-transparent border-0">
            <img src="${imageData.url}" class="card-img-top img-fluid" alt="Image ${startIndex + index}">
            <div class="card-body">
              <p class="card-text">${imageData.description}</p>
            </div>
          </div>
        </div>
      `).join('');
  }
  
  
  function updatePagination() {
    const totalPages = Math.ceil(images.length / itemsPerPage);
    const maxVisiblePages = 3; // Set the maximum number of visible pages
  
    pagination.innerHTML = '';
  
    // Previous Page
    const previousPageItem = document.createElement('li');
    previousPageItem.classList.add('page-item');
    if (currentPage === 1) {
        previousPageItem.classList.add('disabled');
    }
    const previousPageLink = document.createElement('a');
    previousPageLink.classList.add('page-link', 'previousLink');
    previousPageLink.setAttribute('href', '#');
    previousPageLink.textContent = 'Previous';
    previousPageItem.appendChild(previousPageLink);
    pagination.appendChild(previousPageItem);
  
    // Page Items
    const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1));
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
  
    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item');
        const pageLink = document.createElement('a');
        pageLink.classList.add('page-link');
        pageLink.setAttribute('href', '#');
        pageLink.textContent = i;
        pageLink.setAttribute('data-page', i);
        if (i === currentPage) {
            pageItem.classList.add('active');
        }
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }
  
    // Next Page
    const nextPageItem = document.createElement('li');
    nextPageItem.classList.add('page-item');
    if (currentPage === totalPages) {
        nextPageItem.classList.add('disabled');
    }
    const nextPageLink = document.createElement('a');
    nextPageLink.classList.add('page-link', 'nextLink');
    nextPageLink.setAttribute('href', '#');
    nextPageLink.textContent = 'Next';
    nextPageItem.appendChild(nextPageLink);
    pagination.appendChild(nextPageItem);
  }
  
    pagination.addEventListener('click', (event) => {
      event.preventDefault();
    
      const targetPage = event.target.textContent;
    
      if (targetPage === 'Previous' && currentPage > 1) {
        currentPage--;
      } else if (targetPage === 'Next' && currentPage < Math.ceil(images.length / itemsPerPage)) {
        currentPage++;
      } else if (!isNaN(targetPage)) {
        currentPage = parseInt(targetPage);
      }
    
      updatePagination();
      updateGallery();
    });
  
    updatePagination();
    updateGallery();
  });
  