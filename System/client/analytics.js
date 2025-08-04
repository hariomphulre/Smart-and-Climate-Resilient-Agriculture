
document.querySelector('.Analytics').innerHTML = `
    <div class="title">
        <i id="weather" class="fa-solid fa-cloud-sun-rain"></i>
        <h2 id="weather_head">Weather Forecast</h2>
    </div>
`;
function weather(){
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <i id="weather" class="fa-solid fa-cloud-sun-rain"></i>
            <h2 id="weather_head">Weather Forecast</h2>
        </div>
    `;
}

function water(){
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <i id="water" class="fa-solid fa-droplet"></i>
            <h2 id="water_head">Water & Irrigation</h2>
        </div>
    `;
}

function vegetation() {
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <i id="carrot" class="fa-solid fa-carrot"></i>
            <h2 id="vegetation_head">Vegetation & Crop Health</h2>
        </div>
        <div class="vegSection">
            <div class="veg-container">
                <div class="ndviChartDiv">
                    <h3 id="ndvi-chart-title">NDVI - Normalized Difference Vegetation Index</h3>
                    <canvas id="ndviChart"></canvas>
                </div>
                <div class="eviChartDiv">
                    <h3 id="evi-chart-title">EVI - Enhanced Vegetation Index</h3>
                    <canvas id="eviChart"></canvas>
                </div>
                <div class="saviChartDiv">
                    <h3 id="savi-chart-title">SAVI - Soil Adjusted Vegetation Index</h3>
                    <canvas id="saviChart"></canvas>
                </div>
            </div>
            <div class="observ">
                <h3 id="observ-head">Observations</h3>
            </div>
        </div>
    `;

    Papa.parse("ndvi.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const labels = results.data.map(row => row.date);
            const ndviValues = results.data.map(row => parseFloat(row.ndvi));

            const ctx = document.getElementById('ndviChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'NDVI',
                        data: ndviValues,
                        borderColor: 'green',
                        fill: true
                    }]
                }
            });
        }
    });

    Papa.parse("evi.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const labels = results.data.map(row => row.date);
            const eviValues = results.data.map(row => parseFloat(row.evi));

            const ctx = document.getElementById('eviChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'EVI',
                        data: eviValues,
                        borderColor: 'green',
                        fill: true
                    }]
                }
            });
        }
    });

    Papa.parse("savi.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const labels = results.data.map(row => row.date);
            const saviValues = results.data.map(row => parseFloat(row.savi));

            const ctx = document.getElementById('saviChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'SAVI',
                        data: saviValues,
                        borderColor: 'green',
                        fill: true
                    }]
                }
            });
        }
    });
}

function fire(){
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <i id="fire" class="fa-solid fa-fire"></i>
            <h2 id="fire_head">Fire & Hazards</h2>
        </div>
    `;
}

function rain(){
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <i id="rain" class="fa-solid fa-cloud-rain"></i>
            <h2 id="rain_head">Rainfall & Monsoon</h2>
        </div>
    `;
}

function soil(){
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <i id="soil" class="fa-solid fa-seedling"></i>
            <h2 id="soil_head">Soil & Land</h2>
        </div>
    `;
}