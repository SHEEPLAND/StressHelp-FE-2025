// Mock data for testing

const kubiosData = [
  { "timestamp": "2025-04-01T08:00:00Z", "readiness": 80, "stress_index": 28, "rmssd": 46, "mean_hr": 66 },
  { "timestamp": "2025-04-02T08:00:00Z", "readiness": 74, "stress_index": 39, "rmssd": 32, "mean_hr": 60 },
  { "timestamp": "2025-04-03T08:00:00Z", "readiness": 93, "stress_index": 35, "rmssd": 37, "mean_hr": 67 },
  { "timestamp": "2025-04-04T08:00:00Z", "readiness": 65, "stress_index": 20, "rmssd": 41, "mean_hr": 58 },
  { "timestamp": "2025-04-05T08:00:00Z", "readiness": 93, "stress_index": 38, "rmssd": 47, "mean_hr": 59 },
  { "timestamp": "2025-04-06T08:00:00Z", "readiness": 91, "stress_index": 34, "rmssd": 44, "mean_hr": 67 },
  { "timestamp": "2025-04-07T08:00:00Z", "readiness": 79, "stress_index": 27, "rmssd": 39, "mean_hr": 64 },
  { "timestamp": "2025-04-08T08:00:00Z", "readiness": 83, "stress_index": 24, "rmssd": 33, "mean_hr": 68 },
  { "timestamp": "2025-04-09T08:00:00Z", "readiness": 91, "stress_index": 33, "rmssd": 46, "mean_hr": 62 },
  { "timestamp": "2025-04-10T08:00:00Z", "readiness": 87, "stress_index": 22, "rmssd": 40, "mean_hr": 69 },
  { "timestamp": "2025-04-11T08:00:00Z", "readiness": 84, "stress_index": 36, "rmssd": 31, "mean_hr": 65 },
  { "timestamp": "2025-04-12T08:00:00Z", "readiness": 89, "stress_index": 28, "rmssd": 35, "mean_hr": 61 },
  { "timestamp": "2025-04-13T08:00:00Z", "readiness": 85, "stress_index": 26, "rmssd": 42, "mean_hr": 70 },
  { "timestamp": "2025-04-14T08:00:00Z", "readiness": 71, "stress_index": 30, "rmssd": 48, "mean_hr": 63 },
  { "timestamp": "2025-04-15T08:00:00Z", "readiness": 76, "stress_index": 23, "rmssd": 38, "mean_hr": 69 },
]
;

let root;
let chart;

function clearChart() {
  if (root) root.dispose();
}

// Line Chart (Readiness + Stress Index)
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
    renderer: am5xy.AxisRendererY.new(root, {})
  }));

  const formatted = data.map(d => ({
    date: new Date(d.timestamp).getTime(),
    readiness: d.readiness,
    stress_index: d.stress_index
  }));

  const addLine = (field, color, label) => {
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
        strokeWidth: 1,
        stroke: am5.color(0xffffff)
      })
    }));

    series.data.setAll(formatted);
  };

  addLine("readiness", 0x28a745, "Readiness");
  addLine("stress_index", 0xdc3545, "Stress Index");

  chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "zoomX",
    xAxis
  }));

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

// Bar Chart (RMSSD + HR)
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

  const formatted = data.map(d => ({
    label: new Date(d.timestamp).toLocaleDateString('fi-FI'),
    rmssd: d.rmssd,
    mean_hr: d.mean_hr
  }));

  const xAxisRenderer = am5xy.AxisRendererX.new(root, {
    cellStartLocation: 0.1,
    cellEndLocation: 0.9
  });

  const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "label",
    renderer: xAxisRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));

  xAxis.data.setAll(formatted);

  const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1
    })
  }));

  const makeBarSeries = (field, color, label) => {
    const series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: label,
      xAxis,
      yAxis,
      valueYField: field,
      categoryXField: "label",
    }));

    series.columns.template.setAll({
      tooltipText: "{name}, {categoryX}: {valueY}",
      width: am5.percent(90),
      tooltipY: 0,
      strokeOpacity: 0,
      fill: am5.color(color)
    });

    series.data.setAll(formatted);
    legend.data.push(series);
  };

  const legend = chart.children.push(am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  }));

  makeBarSeries("rmssd", 0x007bff, "RMSSD");
  makeBarSeries("mean_hr", 0xff9f40, "Mean HR");

  chart.appear(1000, 100);
}

// Dropdown
document.getElementById("chartTypeSelect").addEventListener("change", (e) => {
  const type = e.target.value;
  if (type === "line") {
    renderLineChart(kubiosData);
  } else {
    renderBarChart(kubiosData);
  }
});

function filterByRange(range) {
  const now = new Date();
  let cutoff = new Date(now);

  if (range === "week") cutoff.setDate(now.getDate() - 7);
  if (range === "month") cutoff.setMonth(now.getMonth() - 1);
  if (range === "3months") cutoff.setMonth(now.getMonth() - 3);

  return kubiosData.filter(d => new Date(d.timestamp) >= cutoff);
}

function updateChartByRange(range) {
  const selectedType = document.getElementById("chartTypeSelect").value;
  const filtered = filterByRange(range);

  if (selectedType === "line") {
    renderLineChart(filtered);
  } else {
    renderBarChart(filtered);
  }
}

// Attach toggle button clicks
document.querySelectorAll(".range-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(".range-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const range = btn.dataset.range;
    updateChartByRange(range);
  });
});


document.getElementById("chartTypeSelect").addEventListener("change", () => {
  const activeRange = document.querySelector(".range-btn.active").dataset.range;
  updateChartByRange(activeRange);
});

// Timeperiod
updateChartByRange("3months");



renderLineChart(kubiosData);

// Placeholder for kubios data
