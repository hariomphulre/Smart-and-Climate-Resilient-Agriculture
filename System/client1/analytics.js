document.querySelector('.Analytics').innerHTML = `
    <div class="title">
        <i id="weather" class="fa-solid fa-cloud-sun-rain"></i>
        <h2 id="weather_head">Weather Forecast</h2>
        <div class="IntervalRange">
            <p id="Interval">Interval:</p>
            <input type="date" id="startDate">
            <p id="to">to</p>
            <input type="date" id="endDate">
        </div>
    </div>
`;

function getStatus(value) {
    if (value >= 90) return "Excellent";
    if (value >= 75) return "Good";
    if (value >= 50) return "Moderate";
    if (value >= 30) return "Bad";
    return "Poor";
}


//////////////////////////////// left bar///////////////////////////////////////

function dashboard(){
    document.querySelector('#loadContent').innerHTML = `
        <div class="title">
            <i id="dashboard" class="fa-solid fa-tractor"></i>
            <h2 id="dashboard_head">Dashboard</h2>
        </div>
    `;
}

///////////////////////////// Climate Analysis ////////////////////////////////////
function weather(){
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <i id="weather" class="fa-solid fa-cloud-sun-rain"></i>
            <h2 id="weather_head">Weather Forecast</h2>
            <div class="IntervalRange">
                <p id="Interval">Interval:</p>
                <input type="date" id="startDate">
                <p id="to">to</p>
                <input type="date" id="endDate">
            </div>
        </div>
    `;
}

function water(){
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <i id="water" class="fa-solid fa-droplet"></i>
            <h2 id="water_head">Water & Irrigation</h2>
            <div class="IntervalRange">
                <p id="Interval">Interval:</p>
                <input type="date" id="startDate">
                <p id="to">to</p>
                <input type="date" id="endDate">
            </div>
        </div>
        <div class="waterSection">
            <div class="water-container">
                <div class="ndwiChartDiv">
                    <div class="chart-info">
                        <h3 id="ndwi-chart-title">
                            NDWI - Normalized Difference Water Index 
                        </h3>
                        <div class="chart-info-content">
                            <p id="defination">It measures the <b>amount and health of green vegetation</b> by comparing how plants reflect near-infrared (NIR) light and absorb red light.</p>
                            <p id="scale-range">Range: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Vigorous plant growth, high leaf area.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Sparse or stressed vegetation.</p>
                        </div>
                    </div>
                    <canvas id="ndwiChart"></canvas>
                </div>
                <div class="ndmiChartDiv">
                    <div class="chart-info">
                        <h3 id="ndmi-chart-title">NDMI - Normalized Difference Moisture Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">It measures the <b>amount and health of green vegetation</b> by comparing how plants reflect near-infrared (NIR) light and absorb red light.</p>
                            <p id="scale-range">Range: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Vigorous plant growth, high leaf area.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Sparse or stressed vegetation.</p>
                        </div>
                    </div>
                    <canvas id="ndmiChart"></canvas>
                </div>
                <div class="lswiChartDiv">
                    <div class="chart-info">
                        <h3 id="lswi-chart-title">LSWI - Land Surface Water Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">It measures the <b>amount and health of green vegetation</b> by comparing how plants reflect near-infrared (NIR) light and absorb red light.</p>
                            <p id="scale-range">Range: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Vigorous plant growth, high leaf area.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Sparse or stressed vegetation.</p>
                        </div>
                    </div>
                    <canvas id="lswiChart"></canvas>
                </div>
                <div class="aweiChartDiv">
                    <div class="chart-info">
                        <h3 id="awei-chart-title">AWEI - Automated Water Extraction Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">It measures the <b>amount and health of green vegetation</b> by comparing how plants reflect near-infrared (NIR) light and absorb red light.</p>
                            <p id="scale-range">Range: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Vigorous plant growth, high leaf area.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Sparse or stressed vegetation.</p>
                        </div>
                    </div>
                    <canvas id="aweiChart"></canvas>
                </div>
                <div class="mndwiChartDiv">
                    <div class="chart-info">
                        <h3 id="mndwi-chart-title">MNDWI - Modified Normalized Difference Moisture Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">It measures the <b>amount and health of green vegetation</b> by comparing how plants reflect near-infrared (NIR) light and absorb red light.</p>
                            <p id="scale-range">Range: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Vigorous plant growth, high leaf area.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Sparse or stressed vegetation.</p>
                        </div>
                    </div>
                    <canvas id="mndwiChart"></canvas>
                </div>
                <div class="sarwiChartDiv">
                    <div class="chart-info">
                        <h3 id="sarwi-chart-title">SARWI - Modified Normalized Difference... Moisture Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">It measures the <b>amount and health of green vegetation</b> by comparing how plants reflect near-infrared (NIR) light and absorb red light.</p>
                            <p id="scale-range">Range: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Vigorous plant growth, high leaf area.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Sparse or stressed vegetation.</p>
                        </div>
                    </div>
                    <canvas id="sarwiChart"></canvas>
                </div>
                <div class="ewiChartDiv">
                    <div class="chart-info">
                        <h3 id="ewi-chart-title">EWI - Modified Normalized Difference... Moisture Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">It measures the <b>amount and health of green vegetation</b> by comparing how plants reflect near-infrared (NIR) light and absorb red light.</p>
                            <p id="scale-range">Range: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Vigorous plant growth, high leaf area.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Sparse or stressed vegetation.</p>
                        </div>
                    </div>
                    <canvas id="ewiChart"></canvas>
                </div>
                
            </div>
            <div class="observ-sec">
                <div class="content1">
                    <div class="conclusion">
                        <h3 id="conclusion-head">Key Observations</h3>
                        <table id="observ-table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Value</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Health</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Stress</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Aging</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Chlorophyll</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="nutrients">
                        <h3 id="nutrients-head">Nutrients Content</h3>
                        <table id="nutrients-table">
                            <thead>
                                <tr>
                                    <th>Nutrients</th>
                                    <th>Value</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Nitrogen</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Phosphorus</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Potassium</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Magnesium</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="recomm-crops">
                        <h3 id="recomm-crops-head">Recommended Crops</h3>
                        <table id="recomm-table">
                            <thead>
                                <th>Crop Type</th>
                                <th>Suitable Options</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Leafy Green</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Vegetables</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Fruits</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Grains</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Pulses</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Herbs/Spices</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="content2">
                    <div class="action">
                        <h3 id="action-head">Action Needed</h3>
                    </div>
                </div>
            </div>
        </div>
    `;

    let index_list=["ewi","sarwi","mndwi","awei","lswi","ndmi","ndwi"];
    for(let i=0;i<index_list.length;i++){

        let name=index_list[i];
        Papa.parse(name+".csv", {
            download: true,
            header: true,
            complete: function(results) {
                const labels = results.data.map(row => row.date);
                const nameValues = results.data.map(row => parseFloat(row[name]));

                const ctx = document.getElementById(name+'Chart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: name,
                            data: nameValues,
                            borderColor: '#0080ffff',
                            fill: true,
                        }]
                    }
                });
            }
        });
    }

    fetch("Climate_Data/water/conclusion/observ.json?cache=" + Date.now())
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("observ-table");
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const paramCell = row.cells[0];
            const valueCell = row.cells[1];
            const statusCell = row.cells[2];

            if (paramCell && valueCell && statusCell) {
                const param = paramCell.textContent.trim();
                const value = data[param];

                if (value !== undefined) {
                    valueCell.textContent = value + "%";
                    statusCell.textContent = getStatus(value);
                }
            }
        });
    })
    .catch(err => console.error("Error loading Conclusion JSON:", err));

    fetch("Climate_Data/water/conclusion/nutrients.json?cache=" + Date.now())
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("nutrients-table");
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const paramCell = row.cells[0];
            const valueCell = row.cells[1];
            const statusCell = row.cells[2];

            if (paramCell && valueCell && statusCell) {
                const param = paramCell.textContent.trim();
                const value = data[param];

                if (value !== undefined) {
                    valueCell.textContent = value + "%";
                    statusCell.textContent = getStatus(value);
                }
            }
        });
    })
    .catch(err => console.error("Error loading Conclusion JSON:", err));

    fetch("Climate_Data/water/conclusion/recomm.json?cache=" + Date.now())
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("recomm-table");
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const paramCell = row.cells[0];
            const valueCell = row.cells[1];
            // const statusCell = row.cells[2];

            if (paramCell && valueCell ) {
                const param = paramCell.textContent.trim();
                const value = data[param];

                if (value !== undefined) {
                    valueCell.textContent = value;
                    // statusCell.textContent = getStatus(value);
                }
            }
        });
    })
    .catch(err => console.error("Error loading Conclusion JSON:", err));
}

function vegetation() {
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <i id="carrot" class="fa-solid fa-carrot"></i>
            <h2 id="vegetation_head">Vegetation & Crop Health</h2>
            <div class="IntervalRange">
                <p id="Interval">Interval:</p>
                <input type="date" id="startDate">
                <p id="to">to</p>
                <input type="date" id="endDate">
            </div>
        </div>
        <div class="vegSection">
            <div class="veg-container">
                <div class="ndviChartDiv">
                    <div class="chart-info">
                        <h3 id="ndvi-chart-title">NDVI - Normalized Difference Vegetation Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">Measures <b>green vegetation amount & health</b> using NIR and red light reflectance.</p>
                            <p id="scale-range"><b>Range</b>: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Greener, healthier, and growing plants.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Less green vegetation, possible water stress, nutrient deficiency, disease, or nearing harvest.</p>
                        </div>
                    </div>
                    <canvas id="ndviChart"></canvas>
                </div>
                <div class="eviChartDiv">
                    <div class="chart-info">
                        <h3 id="evi-chart-title">EVI - Enhanced Vegetation Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">Improves vegetation detection by reducing atmospheric effects and soil background influence.</p>
                            <p id="scale-range"><b>Range</b>: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Vigorous plant growth, high leaf area.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Sparse or stressed vegetation.</p>
                        </div>
                    </div>
                    <canvas id="eviChart"></canvas>
                </div>
                <div class="gciChartDiv">
                    <div class="chart-info">
                        <h3 id="gci-chart-title">GCI - Green Chlorophyll Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">GCI estimates <b>chlorophyll content</b> in leaves, which is linked to <b>nitrogen levels</b> and overall plant health.</p>
                            <p id="scale-range"><b>Range</b>: >0 (varies with crop type)</p>
                            <p id="scale-increase"><b>Increase</b>: Higher chlorophyll, active photosynthesis.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Lower chlorophyll, nutrient deficiency or senescence.</p>
                        </div>
                    </div>
                    <canvas id="gciChart"></canvas>
                </div>
                <div class="psriChartDiv">
                    <div class="chart-info">
                        <h3 id="psri-chart-title">PSRI - Plant Senescence Reflectance Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">Tracks plant <b>aging, stress, and fruit ripening</b> by measuring the ratio of carotenoid (yellow/orange) to chlorophyll (green) pigments.</p>
                            <p id="scale-range"><b>Typical Range</b>: 0 to 0.4 for crops</p>
                            <p id="scale-increase"><b>Increase</b>: Plants moving towards maturity or experiencing stress (drought, pests, nutrient lack).</p>
                            <p id="scale-decrease"><b>Decrease</b>: Plants are younger, healthy, actively growing.</p>
                        </div>
                    </div>
                    <canvas id="psriChart"></canvas>
                </div>
                <div class="ndreChartDiv">
                    <div class="chart-info">
                        <h3 id="ndre-chart-title">NDRE - Normalized Difference Red Edge Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">Measures plant <b>nitrogen and chlorophyll content</b> by using the red-edge light band, making it ideal for monitoring health in dense, mature crops.</p>
                            <p id="scale-range"><b>Range</b>: 0 to 1</p>
                            <p id="scale-increase"><b>Increase</b>: Healthy canopy, high nitrogen content, good biomass.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Low nitrogen, stress, or canopy thinning.</p>
                        </div>
                    </div>
                    <canvas id="ndreChart"></canvas>
                </div>
                <div class="cri1ChartDiv">
                    <div class="chart-info">
                        <h3 id="cri1-chart-title">CRI1 - Carotenoid Reflectance Index 1</h3>
                        <div class="chart-info-content">
                            <p id="defination">CRI1 measures <b>carotenoid pigments</b> in leaves. These pigments increase when plants are stressed or naturally aging.</p>
                            <p id="scale-range"><b>Range</b>: >0 (No fixed range)</p>
                            <p id="scale-increase"><b>Increase</b>: Higher carotenoid content, possible stress</p>
                            <p id="scale-decrease"><b>Decrease</b>: Lower carotenoids, healthy green leaves</p>
                        </div>
                    </div>
                    <canvas id="cri1Chart"></canvas>
                </div>
                
            </div>
            <div class="observ-sec">
                <div class="content1">
                    <div class="conclusion">
                        <h3 id="conclusion-head">Key Observations</h3>
                        <table id="observ-table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Value</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Health</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Stress</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Aging</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Chlorophyll</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="nutrients">
                        <h3 id="nutrients-head">Nutrients Content</h3>
                        <table id="nutrients-table">
                            <thead>
                                <tr>
                                    <th>Nutrients</th>
                                    <th>Value</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Nitrogen</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Phosphorus</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Potassium</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Magnesium</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="recomm-crops">
                        <h3 id="recomm-crops-head">Recommended Crops</h3>
                        <table id="recomm-table">
                            <thead>
                                <th>Crop Type</th>
                                <th>Suitable Options</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Leafy Green</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Vegetables</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Fruits</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Grains</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Pulses</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Herbs/Spices</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="content2">
                    <div class="action">
                        <h3 id="action-head">Action Needed</h3>
                    </div>
                </div>
                
            </div>
            
            
        </div>
    `;


    let index_list=["evi","ndvi","gci","psri","ndre","cri1"];
    for(let i=0;i<index_list.length;i++){

        let name=index_list[i];
        Papa.parse(name+".csv", {
            download: true,
            header: true,
            complete: function(results) {
                const labels = results.data.map(row => row.date);
                const nameValues = results.data.map(row => parseFloat(row[name]));

                const ctx = document.getElementById(name+'Chart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: name,
                            data: nameValues,
                            borderColor: 'green',
                            fill: true
                        }]
                    }
                });
            }
        });
    }
    
    fetch("Climate_Data/vegetation/conclusion/observ.json?cache=" + Date.now())
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("observ-table");
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const paramCell = row.cells[0];
            const valueCell = row.cells[1];
            const statusCell = row.cells[2];

            if (paramCell && valueCell && statusCell) {
                const param = paramCell.textContent.trim();
                const value = data[param];

                if (value !== undefined) {
                    valueCell.textContent = value + "%";
                    statusCell.textContent = getStatus(value);
                }
            }
        });
    })
    .catch(err => console.error("Error loading Conclusion JSON:", err));

    fetch("Climate_Data/vegetation/conclusion/nutrients.json?cache=" + Date.now())
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("nutrients-table");
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const paramCell = row.cells[0];
            const valueCell = row.cells[1];
            const statusCell = row.cells[2];

            if (paramCell && valueCell && statusCell) {
                const param = paramCell.textContent.trim();
                const value = data[param];

                if (value !== undefined) {
                    valueCell.textContent = value + "%";
                    statusCell.textContent = getStatus(value);
                }
            }
        });
    })
    .catch(err => console.error("Error loading Conclusion JSON:", err));

    fetch("Climate_Data/vegetation/conclusion/recomm.json?cache=" + Date.now())
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("recomm-table");
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const paramCell = row.cells[0];
            const valueCell = row.cells[1];
            // const statusCell = row.cells[2];

            if (paramCell && valueCell ) {
                const param = paramCell.textContent.trim();
                const value = data[param];

                if (value !== undefined) {
                    valueCell.textContent = value;
                    // statusCell.textContent = getStatus(value);
                }
            }
        });
    })
    .catch(err => console.error("Error loading Conclusion JSON:", err));


}

function fire(){
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <i id="fire" class="fa-solid fa-fire"></i>
            <h2 id="fire_head">Fire & Hazards</h2>
            <div class="IntervalRange">
                <p id="Interval">Interval:</p>
                <input type="date" id="startDate">
                <p id="to">to</p>
                <input type="date" id="endDate">
            </div>
        </div>
        <div class="fireSection">
            <div class="observ">
                <h3 id="observ-head">Observations</h3>
            </div>
        </div>
    `;
}

function rain(){
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <i id="rain" class="fa-solid fa-cloud-rain"></i>
            <h2 id="rain_head">Rainfall & Monsoon</h2>
            <div class="IntervalRange">
                <p id="Interval">Interval:</p>
                <input type="date" id="startDate">
                <p id="to">to</p>
                <input type="date" id="endDate">
            </div>
        </div>
        <div class="rainSection">
            <div class="observ">
                <h3 id="observ-head">Observations</h3>
            </div>
        </div>
    `;
}

function soil(){
    document.querySelector('.Analytics').innerHTML = `
        <div class="title">
            <i id="soil" class="fa-solid fa-seedling"></i>
            <h2 id="soil_head">Soil & Land</h2>
            <div class="IntervalRange">
                <p id="Interval">Interval:</p>
                <input type="date" id="startDate">
                <p id="to">to</p>
                <input type="date" id="endDate">
            </div>
        </div>
        <div class="soilSection">
            <div class="observ">
                <h3 id="observ-head">Observations</h3>
            </div>
        </div>

        <div class="soilSection">
            <div class="soil-container">
                <div class="bsiChartDiv">
                    <div class="chart-info">
                        <h3 id="bsi-chart-title">BSI - Normalized Difference Vegetation Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">Measures <b>green vegetation amount & health</b> using NIR and red light reflectance.</p>
                            <p id="scale-range"><b>Range</b>: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Greener, healthier, and growing plants.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Less green vegetation, possible water stress, nutrient deficiency, disease, or nearing harvest.</p>
                        </div>
                    </div>
                    <canvas id="bsiChart"></canvas>
                </div>
                <div class="ndtiChartDiv">
                    <div class="chart-info">
                        <h3 id="ndti-chart-title">NDTI - Normalized Difference Vegetation Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">Measures <b>green vegetation amount & health</b> using NIR and red light reflectance.</p>
                            <p id="scale-range"><b>Range</b>: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Greener, healthier, and growing plants.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Less green vegetation, possible water stress, nutrient deficiency, disease, or nearing harvest.</p>
                        </div>
                    </div>
                    <canvas id="ndtiChart"></canvas>
                </div>
                <div class="siChartDiv">
                    <div class="chart-info">
                        <h3 id="si-chart-title">SI - Normalized Difference Vegetation Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">Measures <b>green vegetation amount & health</b> using NIR and red light reflectance.</p>
                            <p id="scale-range"><b>Range</b>: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Greener, healthier, and growing plants.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Less green vegetation, possible water stress, nutrient deficiency, disease, or nearing harvest.</p>
                        </div>
                    </div>
                    <canvas id="siChart"></canvas>
                </div>
                <div class="smiChartDiv">
                    <div class="chart-info">
                        <h3 id="smi-chart-title">SMI - Normalized Difference Vegetation Index</h3>
                        <div class="chart-info-content">
                            <p id="defination">Measures <b>green vegetation amount & health</b> using NIR and red light reflectance.</p>
                            <p id="scale-range"><b>Range</b>: -1 to +1</p>
                            <p id="scale-increase"><b>Increase</b>: Greener, healthier, and growing plants.</p>
                            <p id="scale-decrease"><b>Decrease</b>: Less green vegetation, possible water stress, nutrient deficiency, disease, or nearing harvest.</p>
                        </div>
                    </div>
                    <canvas id="smiChart"></canvas>
                </div>
                
            </div>
            <div class="observ-sec">
                <div class="content1">
                    <div class="conclusion">
                        <h3 id="conclusion-head">Key Observations</h3>
                        <table id="observ-table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Value</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Health</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Stress</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Aging</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Chlorophyll</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="nutrients">
                        <h3 id="nutrients-head">Nutrients Content</h3>
                        <table id="nutrients-table">
                            <thead>
                                <tr>
                                    <th>Nutrients</th>
                                    <th>Value</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Nitrogen</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Phosphorus</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Potassium</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Magnesium</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="recomm-crops">
                        <h3 id="recomm-crops-head">Recommended Crops</h3>
                        <table id="recomm-table">
                            <thead>
                                <th>Crop Type</th>
                                <th>Suitable Options</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Leafy Green</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Vegetables</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Fruits</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Grains</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Pulses</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Herbs/Spices</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="content2">
                    <div class="action">
                        <h3 id="action-head">Action Needed</h3>
                    </div>
                </div>
                
            </div>
            
            
        </div>
    `;
   
    let index_list=["bsi","ndti","si","smi"];
    for(let i=0;i<index_list.length;i++){

        let name=index_list[i];
        Papa.parse(name+".csv", {
            download: true,
            header: true,
            complete: function(results) {
                const labels = results.data.map(row => row.date);
                const nameValues = results.data.map(row => parseFloat(row[name]));

                const ctx = document.getElementById(name+'Chart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: name,
                            data: nameValues,
                            borderColor: '#573000ff',
                            fill: true
                        }]
                    }
                });
            }
        });
    }

    
    fetch("Climate_Data/vegetation/conclusion/observ.json?cache=" + Date.now())
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("observ-table");
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const paramCell = row.cells[0];
            const valueCell = row.cells[1];
            const statusCell = row.cells[2];

            if (paramCell && valueCell && statusCell) {
                const param = paramCell.textContent.trim();
                const value = data[param];

                if (value !== undefined) {
                    valueCell.textContent = value + "%";
                    statusCell.textContent = getStatus(value);
                }
            }
        });
    })
    .catch(err => console.error("Error loading Conclusion JSON:", err));

    fetch("Climate_Data/vegetation/conclusion/nutrients.json?cache=" + Date.now())
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("nutrients-table");
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const paramCell = row.cells[0];
            const valueCell = row.cells[1];
            const statusCell = row.cells[2];

            if (paramCell && valueCell && statusCell) {
                const param = paramCell.textContent.trim();
                const value = data[param];

                if (value !== undefined) {
                    valueCell.textContent = value + "%";
                    statusCell.textContent = getStatus(value);
                }
            }
        });
    })
    .catch(err => console.error("Error loading Conclusion JSON:", err));

    fetch("Climate_Data/vegetation/conclusion/recomm.json?cache=" + Date.now())
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("recomm-table");
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const paramCell = row.cells[0];
            const valueCell = row.cells[1];
            // const statusCell = row.cells[2];

            if (paramCell && valueCell ) {
                const param = paramCell.textContent.trim();
                const value = data[param];

                if (value !== undefined) {
                    valueCell.textContent = value;
                    // statusCell.textContent = getStatus(value);
                }
            }
        });
    })
    .catch(err => console.error("Error loading Conclusion JSON:", err));
        
    

}