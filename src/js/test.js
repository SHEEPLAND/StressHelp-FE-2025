// Mock for testing
const kubiosData = [
  { timestamp: "2025-04-01T08:00:00Z", readiness: 80, stress_index: 28, rmssd: 46, mean_hr: 66, sns_index: 30, pns_index: 45 },
  { timestamp: "2025-04-02T08:00:00Z", readiness: 74, stress_index: 39, rmssd: 32, mean_hr: 60, sns_index: 40, pns_index: 30 },
  { timestamp: "2025-04-03T08:00:00Z", readiness: 93, stress_index: 35, rmssd: 37, mean_hr: 67, sns_index: 33, pns_index: 38 },
  { timestamp: "2025-04-04T08:00:00Z", readiness: 65, stress_index: 20, rmssd: 41, mean_hr: 58, sns_index: 25, pns_index: 48 },
  { timestamp: "2025-04-05T08:00:00Z", readiness: 93, stress_index: 38, rmssd: 47, mean_hr: 59, sns_index: 39, pns_index: 36 },
  { timestamp: "2025-04-06T08:00:00Z", readiness: 91, stress_index: 34, rmssd: 44, mean_hr: 67, sns_index: 31, pns_index: 42 },
  { timestamp: "2025-04-07T08:00:00Z", readiness: 79, stress_index: 27, rmssd: 39, mean_hr: 64, sns_index: 28, pns_index: 40 },
  { timestamp: "2025-04-08T08:00:00Z", readiness: 83, stress_index: 24, rmssd: 33, mean_hr: 68, sns_index: 26, pns_index: 35 },
  { timestamp: "2025-04-09T08:00:00Z", readiness: 91, stress_index: 33, rmssd: 46, mean_hr: 62, sns_index: 30, pns_index: 41 },
  { timestamp: "2025-04-10T08:00:00Z", readiness: 87, stress_index: 22, rmssd: 40, mean_hr: 69, sns_index: 27, pns_index: 43 },
  { timestamp: "2025-04-11T08:00:00Z", readiness: 84, stress_index: 36, rmssd: 31, mean_hr: 65, sns_index: 38, pns_index: 32 },
  { timestamp: "2025-04-12T08:00:00Z", readiness: 89, stress_index: 28, rmssd: 35, mean_hr: 61, sns_index: 29, pns_index: 39 },
  { timestamp: "2025-04-13T08:00:00Z", readiness: 85, stress_index: 26, rmssd: 42, mean_hr: 70, sns_index: 26, pns_index: 44 },
  { timestamp: "2025-04-14T08:00:00Z", readiness: 71, stress_index: 30, rmssd: 48, mean_hr: 63, sns_index: 34, pns_index: 37 },
  { timestamp: "2025-04-15T08:00:00Z", readiness: 76, stress_index: 23, rmssd: 38, mean_hr: 69, sns_index: 24, pns_index: 46 },
];


// Chart root & utility

let root;
let chart;

function clearChart() {
  if (root) root.dispose();
}

// -------------------------------------------
// Line Chart: Readiness and Stress Index
// -------------------------------------------
function renderLineChart(data) {
  clearChart();
  root = am5.Root.new("chartdiv");
  root.setThemes([am5themes_Animated.new(root)]);

  chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
  }));

  const xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
    baseInterval: { timeUnit: "day", count: 1 },
    renderer: am5xy.AxisRendererX.new(root, {})
  }));

  const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  }));

  const formattedData = data.map(d => ({
    date: new Date(d.timestamp).getTime(),
    readiness: d.readiness,
    stress_index: d.stress_index
  }));

  function addLineSeries(field, color, label) {
    const series = chart.series.push(am5xy.LineSeries.new(root, {
      name: label,
      valueYField: field,
      valueXField: "date",
      xAxis,
      yAxis,
      tooltip: am5.Tooltip.new(root, { labelText: `{name}: {valueY}` })
    }));

    series.strokes.template.setAll({ stroke: am5.color(color), strokeWidth: 2 });

    series.bullets.push(() => am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: am5.color(color),
        stroke: am5.color(0xffffff),
        strokeWidth: 1
      })
    }));

    series.data.setAll(formattedData);
  }

  addLineSeries("readiness", 0x28a745, "Readiness");
  addLineSeries("stress_index", 0xdc3545, "Stress Index");

  

  chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomX", xAxis }));
  chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

  const legend = chart.children.push(am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50,
    layout: root.horizontalLayout
  }));



  chart.series.each(series => {
    legend.data.push(series);
    series.get("legendDataItem").get("marker").get("background").setAll({
      fillOpacity: 0,
      strokeOpacity: 1,
      stroke: series.get("stroke"),
      strokeWidth: 2
    });
  });

  chart.appear(1000, 100);
}

// -------------------------------------------
// Bar Chart: RMSSD, Mean HR, PNS, SNS
// -------------------------------------------
function renderBarChart(data) {
  clearChart();
  root = am5.Root.new("chartdiv");
  root.setThemes([am5themes_Animated.new(root)]);

  chart = root.container.children.push(am5xy.XYChart.new(root, {
    layout: root.verticalLayout,
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX"
  }));

  const formattedData = data.map(d => ({
    label: new Date(d.timestamp).toLocaleDateString("fi-FI"),
    rmssd: d.rmssd,
    mean_hr: d.mean_hr,
    sns_index: d.sns_index,
    pns_index: d.pns_index
  }));

  const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "label",
    renderer: am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9
    }),
    tooltip: am5.Tooltip.new(root, {})
  }));

  xAxis.data.setAll(formattedData);

  const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 })
  }));

  const legend = chart.children.push(am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  }));

  function addBarSeries(field, color, label) {
    const series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: label,
      xAxis,
      yAxis,
      valueYField: field,
      categoryXField: "label"
    }));

    series.columns.template.setAll({
      tooltipText: "{name}, {categoryX}: {valueY}",
      width: am5.percent(90),
      tooltipY: 0,
      strokeOpacity: 0,
      fill: am5.color(color)
    });

    series.data.setAll(formattedData);
    legend.data.push(series);
  }

  addBarSeries("rmssd", 0x007bff, "RMSSD");
  addBarSeries("mean_hr", 0xff9f40, "Mean HR");
  addBarSeries("sns_index", 0xff6384, "SNS Index");
  addBarSeries("pns_index", 0x36a2eb, "PNS Index");

  chart.appear(1000, 100);
}

// -------------------------------------------
// Filtering Logic by Time Range
// -------------------------------------------
function filterByRange(range) {
  const now = new Date();
  let cutoff = new Date(now);

  if (range === "week") cutoff.setDate(now.getDate() - 7);
  if (range === "month") cutoff.setMonth(now.getMonth() - 1);
  if (range === "3months") cutoff.setMonth(now.getMonth() - 3);

  return kubiosData.filter(d => new Date(d.timestamp) >= cutoff);
}

function updateChartByRange(range) {
  const chartType = document.getElementById("chartTypeSelect").value;
  const filteredData = filterByRange(range);

  if (chartType === "line") {
    renderLineChart(filteredData);
  } else {
    renderBarChart(filteredData);
  }
}


// Chart type dropdown
document.getElementById("chartTypeSelect").addEventListener("change", () => {
  const activeRange = document.querySelector(".range-btn.active")?.dataset.range || "3months";
  updateChartByRange(activeRange);
});

// Time range buttons
document.querySelectorAll(".range-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".range-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const range = btn.dataset.range;
    updateChartByRange(range);
  });
});


updateChartByRange("3months");
renderLineChart(kubiosData);



// -------------------------------------------
// 1st chart
// -------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const latest = {
    date: '2025-04-16',
    readiness: 82,
    sns: 35,
    pns: 60,
    bpm: 68
  };

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString('fi-FI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

  const formattedDate = formatDate(latest.date);

  // Päivitä arvot kortteihin
  document.getElementById("readiness-value").textContent = `${latest.readiness}%`;
  document.getElementById("sns-value").textContent = latest.sns;
  document.getElementById("pns-value").textContent = latest.pns;
  document.getElementById("bpm-value").textContent = `${latest.bpm} bpm`;

  // Stressitason logiikka
  const stressText = document.getElementById("stress-level-text");
  const readinessVal = latest.readiness;
  let stressLevel = "", message = "";

  if (readinessVal < 50) {
    stressLevel = "Stressi taso: Korkea";
    message = `<p style="color: #ff5555; font-weight: bold;">Suosittelemme vierailemaan 
      <a href="" target="_blank" style="color: #4faae6;">StressHelpin tukisivulla</a>.</p>`;
  } else if (readinessVal < 75) {
    stressLevel = "Stressi taso: Keskitaso";
    message = `<p style="color: #f6b500; font-weight: bold;">Stressitasosi on kohtalainen. Kokeile 
      <a href="" target="_blank" style="color: #4faae6;">rentoutumistyökaluja</a>.</p>`;
  } else {
    stressLevel = "Stressi taso: Matala";
    message = `<p style="color: #84ad83; font-weight: bold;">Hienoa! Stressitasosi on matala. Jatka samaan malliin!</p>`;
  }

  stressText.textContent = stressLevel;
  const recommendationContainer = document.createElement("div");
  recommendationContainer.className = "stress-recommendation";
  recommendationContainer.innerHTML = message;
  stressText.insertAdjacentElement("afterend", recommendationContainer);

  // Chart.js
  const ctx = document.getElementById("resultsChart").getContext("2d");

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Readiness %', 'SNS - Indeksi', 'PNS-Indeksi', 'Keskimääräinen syke'],
      datasets: [{
        label: `Mittauspäivä: ${formattedDate}`,
        data: [latest.readiness, latest.sns, latest.pns, latest.bpm],
        backgroundColor: ['#4E79A7', '#F28E2B', '#76B7B2', '#E15759'], // Modernit värit
        borderRadius: 12,
        barThickness: 40,
        categoryPercentage: 0.6,
        barPercentage: 0.8
        
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              family: 'Poppins',
              size: 20,
              weight: 'bold'
            },
            color: '#333'
          }
        },
        tooltip: {
          backgroundColor: '#f9f9f9',
          titleColor: '#333',
          bodyColor: '#333',
          borderColor: '#ccc',
          borderWidth: 1,
          padding: 10,
          titleFont: { weight: 'bold' },
          callbacks: {
            label: function(context) {
              const label = context.label;
              const value = context.raw;
              if (label === 'Readiness') return `${label}: ${value}%`;
              if (label === 'BPM') return `${label}: ${value} bpm`;
              return `${label}: ${value}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#333',
            font: {
              family: 'Poppins',
              size: 12
            }
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            color: '#333',
            font: {
              family: 'Poppins',
              size: 12
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        }
      }
    }
  });
});
