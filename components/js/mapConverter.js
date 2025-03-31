// Floor plan data structure
const floorPlans = {
    ground: {
        imageUrl: '../assets/ground-floor.png',
        rooms: [
            // Top row of rooms (right side)
            {
                id: 'room-101',
                name: 'Computer Lab 1',
                type: 'lab',
                coordinates: [
                    {x: 800, y: 50},
                    {x: 900, y: 50},
                    {x: 900, y: 150},
                    {x: 800, y: 150}
                ],
                info: {
                    capacity: 40,
                    facilities: ['Computers', 'Projector', 'AC'],
                    schedule: 'Mon-Fri 9AM-5PM'
                }
            },
            {
                id: 'room-102',
                name: 'Computer Lab 2',
                type: 'lab',
                coordinates: [
                    {x: 650, y: 50},
                    {x: 750, y: 50},
                    {x: 750, y: 150},
                    {x: 650, y: 150}
                ],
                info: {
                    capacity: 40,
                    facilities: ['Computers', 'Projector', 'AC'],
                    schedule: 'Mon-Fri 9AM-5PM'
                }
            },
            // Middle section rooms
            {
                id: 'room-103',
                name: 'Lecture Hall 1',
                type: 'classroom',
                coordinates: [
                    {x: 400, y: 200},
                    {x: 600, y: 200},
                    {x: 600, y: 350},
                    {x: 400, y: 350}
                ],
                info: {
                    capacity: 120,
                    facilities: ['Projector', 'AC', 'Audio System'],
                    schedule: 'Mon-Fri 8AM-6PM'
                }
            },
            // Left wing rooms (curved section)
            {
                id: 'room-104',
                name: 'Department Office',
                type: 'office',
                coordinates: [
                    {x: 100, y: 300},
                    {x: 200, y: 300},
                    {x: 220, y: 400},
                    {x: 100, y: 400}
                ],
                info: {
                    capacity: 10,
                    facilities: ['AC', 'Network Points'],
                    schedule: 'Mon-Fri 9AM-5PM'
                }
            },
            {
                id: 'room-105',
                name: 'Tutorial Room 1',
                type: 'classroom',
                coordinates: [
                    {x: 100, y: 450},
                    {x: 200, y: 450},
                    {x: 200, y: 550},
                    {x: 100, y: 550}
                ],
                info: {
                    capacity: 30,
                    facilities: ['Whiteboard', 'Projector'],
                    schedule: 'Mon-Fri 9AM-5PM'
                }
            }
        ],
        paths: [
            // Main corridor
            {
                id: 'main-corridor',
                type: 'path',
                coordinates: 'M 100,200 L 900,200 L 900,250 L 100,250 Z',
                width: 15
            },
            // Left wing corridor
            {
                id: 'left-corridor',
                type: 'path',
                coordinates: 'M 150,250 C 150,400 150,550 150,700',
                width: 10
            },
            // Right wing corridor
            {
                id: 'right-corridor',
                type: 'path',
                coordinates: 'M 850,250 L 850,700',
                width: 10
            }
        ]
    },
    first: {
        imageUrl: '../assets/first-floor.png', // Add your first floor image path here
        rooms: [
            // Add first floor rooms here
        ],
        paths: [
            // Add first floor paths here
        ]
    },
    second: {
        imageUrl: '../assets/second-floor.png', // Add your second floor image path here
        rooms: [
            // Add second floor rooms here
        ],
        paths: [
            // Add second floor paths here
        ]
    }
};

// Convert room coordinates to SVG path
function coordsToPath(coords) {
    return `M ${coords.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
}

// Generate SVG elements for rooms
function generateRoomElements(rooms) {
    return rooms.map(room => {
        const path = coordsToPath(room.coordinates);
        return `
            <path
                id="${room.id}"
                class="room ${room.type}"
                d="${path}"
                data-room-info="${JSON.stringify(room.info)}"
                onmouseover="showRoomInfo(this)"
                onmouseout="hideRoomInfo()"
                onclick="selectRoom(this)"
            />
        `;
    }).join('');
}

// Generate SVG elements for paths
function generatePathElements(paths) {
    return paths.map(path => `
        <path
            id="${path.id}"
            class="path ${path.type}"
            d="${path.coordinates}"
            stroke="#666"
            stroke-width="${path.width}"
            fill="none"
        />
    `).join('');
}

// Load floor plan
function loadFloorPlan(floor) {
    const floorData = floorPlans[floor];
    if (!floorData) return;

    // Update floor plan image
    const floorPlanImage = document.getElementById('floor-plan-image');
    floorPlanImage.src = floorData.imageUrl;

    // Load SVG overlay
    const mapSvg = document.getElementById('map-svg');
    const rooms = generateRoomElements(floorData.rooms);
    const paths = generatePathElements(floorData.paths);
    
    mapSvg.innerHTML = paths + rooms;

    // Reset zoom and pan when changing floors
    resetZoom();
}

// Enhanced room selection handler
function selectRoom(room) {
    // Remove previous selection
    document.querySelectorAll('.room.selected').forEach(r => r.classList.remove('selected'));
    
    // Add selection to clicked room
    room.classList.add('selected');
    
    // Update room info in sidebar with more details
    const info = JSON.parse(room.getAttribute('data-room-info'));
    const infoDiv = document.getElementById('selected-room-info');
    infoDiv.innerHTML = `
        <div style="border-left: 4px solid ${getRoomTypeColor(room.classList[1])}; padding-left: 10px;">
            <h4 style="color: #2c3e50; margin-bottom: 10px;">${room.id} - ${info.name}</h4>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${capitalizeFirst(room.classList[1])}</p>
            <p style="margin: 5px 0;"><strong>Capacity:</strong> ${info.capacity} people</p>
            <p style="margin: 5px 0;"><strong>Facilities:</strong></p>
            <ul style="margin: 5px 0 10px 20px;">
                ${info.facilities.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <p style="margin: 5px 0;"><strong>Schedule:</strong> ${info.schedule}</p>
        </div>
    `;
}

// Helper function to get room type color
function getRoomTypeColor(type) {
    const colors = {
        classroom: '#3498db',
        lab: '#2ecc71',
        office: '#e74c3c',
        other: '#95a5a6'
    };
    return colors[type] || colors.other;
}

// Helper function to capitalize first letter
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Enhanced search functionality
function searchRoom(query) {
    const rooms = document.querySelectorAll('.room');
    const searchQuery = query.toLowerCase();
    
    rooms.forEach(room => {
        const info = JSON.parse(room.getAttribute('data-room-info'));
        const matches = room.id.toLowerCase().includes(searchQuery) ||
                       info.name.toLowerCase().includes(searchQuery) ||
                       info.facilities.some(f => f.toLowerCase().includes(searchQuery)) ||
                       room.classList[1].toLowerCase().includes(searchQuery);
        
        room.style.opacity = matches ? '1' : '0.3';
        room.style.pointerEvents = matches ? 'auto' : 'none';
    });
}

// Initialize search with debouncing
let searchTimeout;
document.querySelector('.search-box').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchRoom(e.target.value);
    }, 300);
});

// Initialize floor selector
document.querySelector('.floor-selector').addEventListener('change', (e) => {
    loadFloorPlan(e.target.value);
}); 