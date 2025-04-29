let kubiosData = [];

const getKubiosData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Sinun täytyy olla kirjautuneena nähdäksesi tämän datan.");
    window.location.href = "login.html";
    return;
  }

  const url ="http://127.0.0.1:3000/api/kubios-data/user-data";
  

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      console.error("Virhe Kubiosin datan hakemisessa:", response.status);
      alert("Virhe datan hakemisessa. Yritä uudelleen.");
      return;
    }

    const data = await response.json();
    console.log('API:n palauttama data:', data);

    if (data && Array.isArray(data.results)) {
      const formatted = data.results
        .filter(item => item.daily_result !== null)
        .map(item => {
          const result = item.result || {};
          return {
            date: item.daily_result,
            timestamp: item.daily_result,
            readiness: result.readiness !== undefined ? parseFloat((result.readiness || 0).toFixed(1)) : 0,
            stress_index: result.stress_index !== undefined ? parseFloat((result.stress_index || 0).toFixed(2)) : 0,
            rmssd_ms: result.rmssd_ms !== undefined ? parseFloat((result.rmssd_ms || 0).toFixed(1)) : 0,
            mean_hr_bpm: result.mean_hr_bpm !== undefined ? parseFloat((result.mean_hr_bpm || 0).toFixed(0)) : 0,
          };
        });

      kubiosData = formatted;
      if (formatted.length > 0) {
        renderLatestSummary(formatted[formatted.length - 1]);
        updateChartByRange("3months");
      } else {
        console.warn("Ei dataa näytettäväksi.");
        alert("Ei Kubios-dataa saatavilla.");
      }
    } else {
      console.error('Datan rakenteessa on virhe.');
    }

  } catch (error) {
    console.error("Virhe API-kutsussa:", error);
    alert("Jokin meni pieleen. Yritä myöhemmin.");
  }
};

function renderLatestSummary(latest) {
  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString('fi-FI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

  const formattedDate = formatDate(latest.date);

  document.getElementById("readiness-value").textContent = `${latest.readiness}%`;
  document.getElementById("mean-hr-value").textContent = `${latest.mean_hr_bpm} bpm`;
  document.getElementById("rmssd-value").textContent = `${latest.rmssd_ms} ms`;
  document.getElementById("stress-index-value").textContent = `${latest.stress_index}`;

  const stressText = document.getElementById("stress-level-text");
  let stressLevel = "", message = "";

  if (latest.readiness < 50) {
    stressLevel = "Stressi taso: Korkea";
    message = `<p style="color: #ff5555; font-weight: bold;">Suosittelemme vierailemaan 
      <a href="" target="_blank" style="color: #4faae6;">StressHelpin tukisivulla</a>.</p>`;
  } else if (latest.readiness < 75) {
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

  const ctx = document.getElementById("resultsChart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Readiness %', 'BPM', 'RMSSD (ms)', 'Stress Index'],
      datasets: [{
        label: `Mittauspäivä: ${formattedDate}`,
        data: [latest.readiness, latest.mean_hr_bpm, latest.rmssd_ms, latest.stress_index],
        backgroundColor: ['#4E79A7', '#F28E2B', '#76B7B2', '#E15759'],
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
            font: { family: 'Poppins', size: 20, weight: 'bold' },
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
              const label = context.dataset.label || '';
              let value = context.raw;
              if (context.label === 'Readiness %') {
                return `${label}: ${value.toFixed(1)}%`;
              } else if (context.label === 'BPM') {
                return `${label}: ${value.toFixed(0)} bpm`;
              } else if (context.label === 'RMSSD (ms)') {
                return `${label}: ${value.toFixed(1)} ms`;
              } else {
                return `${label}: ${value.toFixed(2)}`;
              }
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#333', font: { family: 'Poppins', size: 12 } },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { 
            precision: 0, 
            color: '#333', 
            font: { family: 'Poppins', size: 12 },
            callback: function(value) {
              return value.toFixed(0);
            }
          },
          grid: { color: 'rgba(0,0,0,0.05)' }
        }
      }
    }
  });
}

// Chart rendering logic (line/bar)
let root;
let chart;

function clearChart() {
  if (root) root.dispose();
}

function renderLineChart(data) {
  clearChart();
  root = am5.Root.new("chartdiv");
  root.setThemes([am5themes_Animated.new(root)]);

  chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX"
  }));

  const xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
    baseInterval: { timeUnit: "day", count: 1 },
    renderer: am5xy.AxisRendererX.new(root, {})
  }));

  const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {}),
    numberFormat: "#.##"
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
      tooltip: am5.Tooltip.new(root, { 
        labelText: field === "readiness" ? 
          `{name}: {valueY.formatNumber('#.0')}%` : 
          `{name}: {valueY.formatNumber('#.00')}` 
      })
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
    label: new Date(d.date).toLocaleDateString("fi-FI"),
    rmssd_ms: d.rmssd_ms,
    mean_hr_bpm: d.mean_hr_bpm,
    stress_index: d.stress_index,
    readiness: d.readiness
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
    renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
    numberFormat: "#.##"
  }));

  const legend = chart.children.push(am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  }));

  function addBarSeries(field, color, label) {
    let numberFormat;
    if (field === "mean_hr_bpm") {
      numberFormat = "#,###";
    } else if (field === "rmssd_ms") {
      numberFormat = "#.#";
    } else {
      numberFormat = "#.##";
    }
    
    const series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: label,
      xAxis,
      yAxis,
      valueYField: field,
      categoryXField: "label"
    }));

    series.columns.template.setAll({
      tooltipText: `{name}, {categoryX}: {valueY.formatNumber('${numberFormat}')}`,
      width: am5.percent(90),
      tooltipY: 0,
      strokeOpacity: 0,
      fill: am5.color(color)
    });

    series.data.setAll(formattedData);
    legend.data.push(series);
  }

  addBarSeries("rmssd_ms", 0x007bff, "RMSSD");
  addBarSeries("mean_hr_bpm", 0xff9f40, "BPM");
  addBarSeries("stress_index", 0xff6384, "Stress Index");
  addBarSeries("readiness", 0x36a2eb, "Readiness");

  chart.appear(1000, 100);
}

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

  if (filteredData.length === 0) {
    console.warn("Ei dataa valitulle aikajaksolle.");
    clearChart();
    return;
  }

  if (chartType === "line") {
    renderLineChart(filteredData);
  } else {
    renderBarChart(filteredData);
  }
}

// UI event listeners
document.getElementById("chartTypeSelect").addEventListener("change", () => {
  const activeRange = document.querySelector(".range-btn.active")?.dataset.range || "3months";
  updateChartByRange(activeRange);
});

document.querySelectorAll(".range-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".range-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const range = btn.dataset.range;
    updateChartByRange(range);
  });
});

document.addEventListener("DOMContentLoaded", getKubiosData);