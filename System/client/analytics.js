function vegetation() {
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <h2 id="vegetation_h1">Vegetation & Crop Health</h2>
        </div>
        <div class="container">
            <div class="chart">
                <h3 id="ndvi-chart-title">NDVI (Normalized difference vegetation index)</h3>
                <canvas id="ndviChart"></canvas>
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
}

function fire(){
    document.querySelector('.Analytics').innerHTML = "Hello from JavaScript!";
}
