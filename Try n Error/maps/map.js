// Floor plan data structure
const floorPlans = {
    ground: {
        imageUrl: '../assets/ground-floor.png',
        rooms: [
            {
                id: 'room-001',
                name: 'Classroom 101',
                type: 'classroom',
                coordinates: [
                    {x: 100, y: 100},
                    {x: 200, y: 100},
                    {x: 200, y: 200},
                    {x: 100, y: 200}
                ],
                info: {
                    capacity: 60,
                    facilities: ['Projector', 'AC', 'Whiteboard'],
                    schedule: 'Mon-Fri 9AM-5PM'
                }
            }
        ],
        paths: [
            {
                id: 'corridor-1',
                type: 'path',
                coordinates: 'M 50,50 L 300,50 L 300,400 L 50,400 Z',
                width: 20
            }
        ]
    },
    first: {
        imageUrl: '../assets/first-floor.png',
        rooms: [],
        paths: []
    },
    second: {
        imageUrl: '../assets/second-floor.png',
        rooms: [],
        paths: []
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
            <path id="${room.id}" class="room ${room.type}" d="${path}"
                data-room-info='${JSON.stringify(room.info)}'
                onmouseover="showRoomInfo(this)"
                onmouseout="hideRoomInfo()"
                onclick="selectRoom(this)" />
        `;
    }).join('');
}

// Generate SVG elements for paths
function generatePathElements(paths) {
    return paths.map(path => `
        <path id="${path.id}" class="path ${path.type}" d="${path.coordinates}"
            stroke="#666" stroke-width="${path.width}" fill="none" />
    `).join('');
}

// Load and display selected floor plan
function loadFloorPlan(floor) {
    const floorData = floorPlans[floor];
    if (!floorData) return;

    // Update floor plan image
    document.getElementById('floor-plan-image').src = floorData.imageUrl;
    
    // Load SVG overlay
    const mapSvg = document.getElementById('map-svg');
    mapSvg.innerHTML = generatePathElements(floorData.paths) + generateRoomElements(floorData.rooms);

    // Reset zoom when changing floors
    resetZoom();
}

// Handle room selection
function selectRoom(room) {
    document.querySelectorAll('.room.selected').forEach(r => r.classList.remove('selected'));
    room.classList.add('selected');
    
    // Update sidebar info
    const info = JSON.parse(room.getAttribute('data-room-info'));
    document.getElementById('selected-room-info').innerHTML = `
        <h4>${room.id}</h4>
        <p>Capacity: ${info.capacity}</p>
        <p>Facilities: ${info.facilities.join(', ')}</p>
        <p>Schedule: ${info.schedule}</p>
    `;
}

// Search functionality to highlight matching rooms
function searchRoom(query) {
    document.querySelectorAll('.room').forEach(room => {
        const info = JSON.parse(room.getAttribute('data-room-info'));
        const matches = room.id.toLowerCase().includes(query.toLowerCase()) ||
                       info.facilities.some(f => f.toLowerCase().includes(query.toLowerCase()));
        room.style.opacity = matches ? '1' : '0.3';
    });
}

// Event listeners for search and floor selection
document.querySelector('.search-box').addEventListener('input', (e) => searchRoom(e.target.value));
document.querySelector('.floor-selector').addEventListener('change', (e) => loadFloorPlan(e.target.value));