document.addEventListener('DOMContentLoaded', () => {
    const reportSection = document.getElementById('report-section');
    const processingSection = document.getElementById('processing-section');
    const protocolSection = document.getElementById('protocol-section');
    
    const inputArea = document.getElementById('emergency-input');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn');
    const locationStatus = document.getElementById('location-status');
    const tags = document.querySelectorAll('.tag');

    let userLocation = null;

    // 1. Detect Location (Simulated or Real)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                locationStatus.innerHTML = '<span class="status-dot"></span> Location Secured';
            },
            () => {
                locationStatus.innerHTML = 'Location Unavailable (Using Default)';
            }
        );
    }

    // 2. Handle Tags
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            inputArea.value = tag.getAttribute('data-input');
        });
    });

    // 3. Submit Emergency Report
    submitBtn.addEventListener('click', async () => {
        const input = inputArea.value.trim();
        if (!input) {
            alert('Please provide some information about the emergency.');
            return;
        }

        // Show loading
        reportSection.style.display = 'none';
        processingSection.style.display = 'block';

        try {
            const response = await fetch('/api/emergency/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input,
                    location: userLocation
                })
            });

            const data = await response.json();
            displayResult(data);
        } catch (error) {
            console.error('Submission Error:', error);
            alert('Service connection error. Follow general safety protocols.');
            showFallback();
        }
    });

    // 4. Display Results
    function displayResult(data) {
        processingSection.style.display = 'none';
        protocolSection.style.display = 'block';

        // Set Badges
        const severityBadge = document.getElementById('severity-badge');
        severityBadge.textContent = data.severity.toUpperCase();
        severityBadge.className = `badge ${data.severity.toUpperCase()}`;
        
        document.getElementById('incident-category').textContent = `${data.category.toUpperCase()} EMERGENCY`;
        
        // Populate Steps
        populateList('immediate-steps', data.protocol.immediate);
        populateList('next-steps', data.protocol.next);
        populateList('trapped-steps', data.protocol.if_trapped);

        // Nearby Services
        const servicesList = document.getElementById('nearby-services');
        servicesList.innerHTML = '';
        if (data.nearbyServices && data.nearbyServices.length > 0) {
            data.nearbyServices.slice(0, 3).forEach(service => {
                const div = document.createElement('div');
                div.className = 'service-item';
                div.innerHTML = `<strong>${service.name}</strong><span>${service.address}</span>`;
                servicesList.appendChild(div);
            });
        } else {
            servicesList.innerHTML = '<p>No specific services identified nearby.</p>';
        }

        // Reasoning
        document.getElementById('ai-reasoning').textContent = data.reasoning;
    }

    function populateList(id, items) {
        const ul = document.getElementById(id);
        ul.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
    }

    function showFallback() {
        processingSection.style.display = 'none';
        // Add minimal fallback display logic if needed
    }

    // 5. Reset
    resetBtn.addEventListener('click', () => {
        protocolSection.style.display = 'none';
        reportSection.style.display = 'block';
        inputArea.value = '';
    });
});
