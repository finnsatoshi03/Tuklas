const tooltip = document.getElementById("tooltip");
const svgElement = document.getElementById("base");
const svgContainer = svgElement.closest("div");

let currentZoom = 1;
const minZoom = 0.5;
const maxZoom = 3;

let isPanning = false;
let startX, startY;
let translateX = 0,
  translateY = 0;

// Zoom function
function zoom(delta, clientX, clientY) {
  const rect = svgElement.getBoundingClientRect();
  const mouseX = clientX - rect.left;
  const mouseY = clientY - rect.top;

  // Calculate new zoom
  const newZoom = Math.max(
    minZoom,
    Math.min(maxZoom, currentZoom * (delta > 0 ? 0.9 : 1.1))
  );
  const zoomFactor = newZoom / currentZoom;

  // Update translate to zoom towards mouse point
  translateX = mouseX - (mouseX - translateX) * zoomFactor;
  translateY = mouseY - (mouseY - translateY) * zoomFactor;

  // Apply transformation
  currentZoom = newZoom;
  updateTransform();
}

// Pan function
function pan(clientX, clientY) {
  const deltaX = clientX - startX;
  const deltaY = clientY - startY;

  translateX += deltaX;
  translateY += deltaY;

  startX = clientX;
  startY = clientY;

  updateTransform();
}

// Update SVG transform
function updateTransform() {
  // Get SVG dimensions
  const svgWidth = svgElement.clientWidth;
  const svgHeight = svgElement.clientHeight;

  // Calculate max translation based on zoom
  const maxTranslateX = (svgWidth * (currentZoom - 1)) / 2;
  const maxTranslateY = (svgHeight * (currentZoom - 1)) / 2;

  // Clamp translation
  translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
  translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));

  // Set transform origin to center
  svgElement.style.transformOrigin = "center center";

  // Apply transform with centered origin
  svgElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
}

// Mouse wheel zoom
svgElement.addEventListener("wheel", (e) => {
  e.preventDefault();
  zoom(e.deltaY, e.clientX, e.clientY);
});

// Mouse pan
svgElement.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isPanning = true;
  startX = e.clientX;
  startY = e.clientY;
  svgElement.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (isPanning) {
    e.preventDefault();
    pan(e.clientX, e.clientY);
  }
});

document.addEventListener("mouseup", () => {
  if (isPanning) {
    isPanning = false;
    svgElement.style.cursor = "grab";
  }
});

// Touch support for mobile
let touchZoom = false;

svgElement.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    // Pinch zoom
    touchZoom = true;
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    initialPinchDistance = Math.hypot(
      touch1.pageX - touch2.pageX,
      touch1.pageY - touch2.pageY
    );
    initialZoom = currentZoom;
  } else if (e.touches.length === 1 && !touchZoom) {
    // Pan
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isPanning = true;
  }
});

svgElement.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    // Pinch zoom
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const currentPinchDistance = Math.hypot(
      touch1.pageX - touch2.pageX,
      touch1.pageY - touch2.pageY
    );
    const pinchFactor = currentPinchDistance / initialPinchDistance;
    const newZoom = initialZoom * pinchFactor;
    currentZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    updateTransform();
  } else if (e.touches.length === 1 && !touchZoom) {
    // Pan
    pan(e.touches[0].clientX, e.touches[0].clientY);
  }
});

svgElement.addEventListener("touchend", (e) => {
  if (e.touches.length < 2) {
    touchZoom = false;
    isPanning = false;
  }
});

// Reset zoom on double click/tap
svgElement.addEventListener("dblclick", () => {
  currentZoom = 1;
  translateX = 0;
  translateY = 0;
  updateTransform();
});

// Initial styling
svgElement.style.cursor = "grab";
svgElement.style.transformOrigin = "center center";
svgElement.style.transition = "transform 0.2s ease";

// Prevent default touch behaviors
svgElement.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
  },
  { passive: false }
);

svgElement.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
  },
  { passive: false }
);

// Make SVG responsive
function resizeSVG() {
  const container = svgElement.closest("div");
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  svgElement.style.maxWidth = "100%";
}

// Resize on load and window resize
window.addEventListener("resize", resizeSVG);
resizeSVG();

// Function to add tooltip to all paths
function addTooltipToPath(pathId) {
  const path = document.getElementById(pathId);

  // Ensure the path exists
  if (!path) return;

  path.addEventListener("mousemove", (e) => {
    // Convert camelCase or hyphenated IDs to title case
    const formattedName = pathId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    tooltip.innerHTML = `
      <h3 style="margin: 0; font-weight: bold; font-size: 16px;">${formattedName}</h3>
    `;

    tooltip.style.display = "block";
    tooltip.style.left = `${e.pageX + 10}px`;
    tooltip.style.top = `${e.pageY + 10}px`;
  });

  path.addEventListener("mouseout", () => {
    tooltip.style.display = "none";
  });
}

// Barangay Details Data
const barangayDetails = {
  taguig: {
    name: "Taguig",
    population: "299,521",
    area: 53.33,
    zipCode: "1631",
    description:
      "The primary city barangay, home to major business districts and government offices.",
  },
  "fort-bonifacio": {
    name: "Fort Bonifacio",
    population: "87,234",
    area: 12.5,
    zipCode: "1634",
    description:
      "A modern urban center known for Bonifacio Global City (BGC), high-rise buildings, and commercial spaces.",
  },
  pitogo: {
    name: "Pitogo",
    population: "22,456",
    area: 3.2,
    zipCode: "1637",
    description:
      "A residential barangay with a mix of middle-class housing and local amenities.",
  },
  napindan: {
    name: "Napindan",
    population: "15,234",
    area: 2.8,
    zipCode: "1638",
    description:
      "A barangay located near waterways, with a blend of residential and industrial areas.",
  },
  "south-cembo": {
    name: "South Cembo",
    population: "18,765",
    area: 2.5,
    zipCode: "1632",
    description:
      "A compact residential area with a diverse community and local small businesses.",
  },
  cembo: {
    name: "Cembo",
    population: "20,321",
    area: 2.7,
    zipCode: "1632",
    description:
      "A densely populated barangay with a mix of residential buildings and community facilities.",
  },
  "west-rembo": {
    name: "West Rembo",
    population: "17,543",
    area: 2.3,
    zipCode: "1633",
    description:
      "A predominantly residential barangay with a strong sense of community and local infrastructure.",
  },
  "east-rembo": {
    name: "East Rembo",
    population: "16,987",
    area: 2.2,
    zipCode: "1633",
    description:
      "A vibrant barangay with a mix of residential areas and small commercial establishments.",
  },
  comembo: {
    name: "Comembo",
    population: "15,678",
    area: 2.0,
    zipCode: "1633",
    description:
      "A community-oriented barangay with a blend of residential spaces and local businesses.",
  },
  pembo: {
    name: "Pembo",
    population: "19,234",
    area: 2.6,
    zipCode: "1632",
    description:
      "A bustling barangay with diverse housing options and community services.",
  },
  rizal: {
    name: "Rizal",
    population: "14,567",
    area: 1.9,
    zipCode: "1637",
    description:
      "A compact barangay with a mix of residential and small commercial areas.",
  },
  pinagsama: {
    name: "Pinagsama",
    population: "12,345",
    area: 1.7,
    zipCode: "1637",
    description:
      "A close-knit residential community with local amenities and green spaces.",
  },
  "western-bicutan": {
    name: "Western Bicutan",
    population: "25,678",
    area: 3.5,
    zipCode: "1630",
    description:
      "A diverse barangay with residential complexes and proximity to major infrastructure.",
  },
  "upper-bicutan": {
    name: "Upper Bicutan",
    population: "22,456",
    area: 3.2,
    zipCode: "1630",
    description:
      "An elevated residential area with a mix of housing types and community facilities.",
  },
  "central-bicutan": {
    name: "Central Bicutan",
    population: "20,987",
    area: 2.9,
    zipCode: "1630",
    description:
      "The central hub of Bicutan, offering a balance of residential and commercial spaces.",
  },
  "north-daang-hari": {
    name: "North Daang Hari",
    population: "16,543",
    area: 2.4,
    zipCode: "1630",
    description:
      "A developing residential area with modern infrastructure and community developments.",
  },
  tanyag: {
    name: "Tanyag",
    population: "18,765",
    area: 2.6,
    zipCode: "1630",
    description:
      "A growing barangay with a mix of residential spaces and emerging commercial zones.",
  },
  "south-daang-hari": {
    name: "South Daang Hari",
    population: "15,432",
    area: 2.2,
    zipCode: "1630",
    description:
      "A residential barangay with developing infrastructure and community services.",
  },
  bagumbayan: {
    name: "Bagumbayan",
    population: "23,456",
    area: 3.3,
    zipCode: "1634",
    description:
      "A vibrant barangay with a mix of residential areas, schools, and local businesses.",
  },
  "lower-bicutan": {
    name: "Lower Bicutan",
    population: "26,789",
    area: 3.7,
    zipCode: "1630",
    description:
      "A populous barangay with diverse residential options and community infrastructure.",
  },
  "maharlika-village": {
    name: "Maharlika Village",
    population: "14,321",
    area: 2.0,
    zipCode: "1637",
    description:
      "A residential subdivision with a strong community character and local amenities.",
  },
  "new-lower-bicutan": {
    name: "New Lower Bicutan",
    population: "19,876",
    area: 2.8,
    zipCode: "1630",
    description:
      "A developing residential area with modern housing and community facilities.",
  },
  "south-signal-village": {
    name: "South Signal Village",
    population: "17,654",
    area: 2.5,
    zipCode: "1630",
    description:
      "A residential barangay with a mix of housing types and local community services.",
  },
  "central-signal-village": {
    name: "Central Signal Village",
    population: "16,543",
    area: 2.3,
    zipCode: "1630",
    description:
      "The central area of Signal Village, offering a blend of residential and commercial spaces.",
  },
  "north-signal-village": {
    name: "North Signal Village",
    population: "15,432",
    area: 2.1,
    zipCode: "1630",
    description:
      "A residential barangay with developing infrastructure and community amenities.",
  },
  suparan: {
    name: "Suparan",
    population: "11,234",
    area: 1.6,
    zipCode: "1637",
    description:
      "A compact barangay with a close-knit community and local residential character.",
  },
  ususan: {
    name: "Ususan",
    population: "20,543",
    area: 2.9,
    zipCode: "1638",
    description:
      "A bustling barangay with a mix of residential areas and emerging commercial zones.",
  },
  hagonoy: {
    name: "Hagonoy",
    population: "13,456",
    area: 1.9,
    zipCode: "1638",
    description:
      "A riverside barangay with a unique community character and local amenities.",
  },
  "san-miguel": {
    name: "San Miguel",
    population: "12,345",
    area: 1.7,
    zipCode: "1638",
    description:
      "A small but vibrant barangay with a strong sense of community and local services.",
  },
  bambang: {
    name: "Bambang",
    population: "16,789",
    area: 2.4,
    zipCode: "1638",
    description:
      "A diverse barangay with residential spaces and proximity to key infrastructure.",
  },
  tuktukan: {
    name: "Tuktukan",
    population: "10,987",
    area: 1.5,
    zipCode: "1638",
    description:
      "A compact barangay with a unique community layout and local residential character.",
  },
  "calzada-tipas": {
    name: "Calzada Tipas",
    population: "14,567",
    area: 2.0,
    zipCode: "1638",
    description:
      "A barangay with a mix of residential areas and community infrastructure.",
  },
  wawa: {
    name: "Wawa",
    population: "13,654",
    area: 1.8,
    zipCode: "1638",
    description:
      "A riverside barangay with a distinct community character and local amenities.",
  },
  "sta-ana": {
    name: "Sta. Ana",
    population: "15,432",
    area: 2.1,
    zipCode: "1638",
    description:
      "A residential barangay with a mix of housing types and community services.",
  },
  "palingon-tipas": {
    name: "Palingon Tipas",
    population: "16,543",
    area: 2.3,
    zipCode: "1638",
    description:
      "A developing barangay with residential spaces and emerging local infrastructure.",
  },
  "ligid-tipas": {
    name: "Ligid Tipas",
    population: "12,345",
    area: 1.7,
    zipCode: "1638",
    description:
      "A compact barangay with a strong community spirit and local residential character.",
  },
  "ibayo-tipas": {
    name: "Ibayo Tipas",
    population: "14,321",
    area: 2.0,
    zipCode: "1638",
    description:
      "A barangay with a mix of residential areas and community facilities.",
  },
};

// Create sidebar element if it doesn't exist
function createSidebar() {
  const existingSidebar = document.getElementById("barangay-sidebar");
  if (existingSidebar) return existingSidebar;

  const sidebar = document.createElement("div");
  sidebar.id = "barangay-sidebar";
  sidebar.style.cssText = `
      position: fixed;
      top: 5rem;
      left: -400px;
      width: 25rem;
      height: fit-content;
      margin-left: 25px;
      border-radius: 0.5rem;
      background-color: white;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      transition: left 0.3s ease;
      z-index: 1000;
      padding: 20px;
      overflow-y: auto;
    `;

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;";
  closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    `;

  closeButton.addEventListener("click", closeSidebar);

  const content = document.createElement("div");
  content.id = "barangay-sidebar-content";

  sidebar.appendChild(closeButton);
  sidebar.appendChild(content);
  document.body.appendChild(sidebar);

  return sidebar;
}

// Open sidebar with barangay details
function openBarangaySidebar(pathId) {
  const sidebar = createSidebar();
  const contentArea = document.getElementById("barangay-sidebar-content");
  const details = barangayDetails[pathId];

  if (!details) {
    console.error(`No details found for barangay: ${pathId}`);
    return;
  }

  contentArea.innerHTML = `
      <h2 style="margin-bottom: 15px;">${details.name} Barangay</h2>
      <div style="margin-bottom: 15px;">
        <strong>Population:</strong> ${details.population.toLocaleString()}
      </div>
      <div style="margin-bottom: 15px;">
        <strong>Area:</strong> ${details.area} sq km
      </div>
      <div style="margin-bottom: 15px;">
        <strong>Zip Code:</strong> ${details.zipCode}
      </div>
      <p>${details.description}</p>
    `;

  sidebar.style.left = "0";
}

// Close sidebar
function closeSidebar() {
  const sidebar = document.getElementById("barangay-sidebar");
  if (sidebar) {
    sidebar.style.left = "-400px";
  }
}

// Add click events to all barangay paths
function addClickToPath(pathId) {
  const path = document.getElementById(pathId);

  if (!path) return;

  path.addEventListener("click", () => {
    openBarangaySidebar(pathId);
  });
}

// List of all path IDs to add click events
const barangayPaths = [
  "taguig",
  "fort-bonifacio",
  "pitogo",
  "south-cembo",
  "cembo",
  "west-rembo",
  "east-rembo",
  "comembo",
  "pembo",
  "rizal",
  "pinagsama",
  "western-bicutan",
  "upper-bicutan",
  "central-bicutan",
  "north-daang-hari",
  "tanyag",
  "south-daang-hari",
  "bagumbayan",
  "lower-bicutan",
  "maharlika-village",
  "new-lower-bicutan",
  "south-signal-village",
  "central-signal-village",
  "north-signal-village",
  "suparan",
  "ususan",
  "hagonoy",
  "san-miguel",
  "bambang",
  "tuktukan",
  "calzada-tipas",
  "wawa",
  "sta-ana",
  "palingon-tipas",
  "ligid-tipas",
  "ibayo-tipas",
  "napindan",
];

// Add click events to all barangay paths
barangayPaths.forEach(addClickToPath);
barangayPaths.forEach(addTooltipToPath);

const hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navItems.classList.toggle("active");
});

// Close mobile menu when a link is clicked
const navItems = document.querySelector(".nav-items");
const navLinks = document.querySelectorAll(".nav-items a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navItems.classList.remove("active");
  });
});
