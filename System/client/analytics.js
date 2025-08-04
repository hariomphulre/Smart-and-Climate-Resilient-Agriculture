
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
        <div class="waterSection">
            <div class="water-container">
                <div class="ndwiChartDiv">
                    <h3 id="ndwi-chart-title">NDWI - Normalized Difference Water Index</h3>
                    <canvas id="ndwiChart"></canvas>
                </div>
                <div class="ndmiChartDiv">
                    <h3 id="ndmi-chart-title">NDMI - Normalized Difference Moisture Index</h3>
                    <canvas id="ndmiChart"></canvas>
                </div>
                <div class="lswiChartDiv">
                    <h3 id="lswi-chart-title">LSWI - Land Surface Water Index</h3>
                    <canvas id="lswiChart"></canvas>
                </div>
            </div>
            <div class="observ">
                <h3 id="observ-head">Observations</h3>
            </div>
        </div>
    `;

    Papa.parse("ndwi.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const labels = results.data.map(row => row.date);
            const ndwiValues = results.data.map(row => parseFloat(row.ndwi));

            const ctx = document.getElementById('ndwiChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'NDWI',
                        data: ndwiValues,
                        borderColor: '#0080ffff',
                        fill: true
                    }]
                }
            });
        }
    });

    Papa.parse("ndmi.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const labels = results.data.map(row => row.date);
            const ndmiValues = results.data.map(row => parseFloat(row.ndmi));

            const ctx = document.getElementById('ndmiChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'NDMI',
                        data: ndmiValues,
                        borderColor: '#0080ffff',
                        fill: true
                    }]
                }
            });
        }
    });

    Papa.parse("lswi.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const labels = results.data.map(row => row.date);
            const lswiValues = results.data.map(row => parseFloat(row.lswi));

            const ctx = document.getElementById('lswiChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'LSWI',
                        data: lswiValues,
                        borderColor: '#0080ffff',
                        fill: true
                    }]
                }
            });
        }
    });
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
                <div class="gciChartDiv">
                    <h3 id="gci-chart-title">GCI - Green Chlorophyll Index</h3>
                    <canvas id="gciChart"></canvas>
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

    Papa.parse("gci.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const labels = results.data.map(row => row.date);
            const gciValues = results.data.map(row => parseFloat(row.gci));

            const ctx = document.getElementById('gciChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'GCI',
                        data: gciValues,
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