import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, ScatterChart, Scatter, ComposedChart } from "recharts";

const RAW = [
  {d:"2026-01-02",dist:7.03,mt:2298,type:"Run",re:43},{d:"2026-01-05",dist:4.27,mt:1595,type:"Run",re:16},
  {d:"2026-01-06",dist:6.01,mt:1905,type:"Run",re:10},{d:"2026-01-06",dist:0,mt:2276,type:"Strength",re:15},
  {d:"2026-01-07",dist:0,mt:1786,type:"HIIT",re:62},{d:"2026-01-08",dist:7.47,mt:2527,type:"Run",re:41},
  {d:"2026-01-09",dist:0,mt:1767,type:"HIIT",re:77},{d:"2026-01-12",dist:8.28,mt:2462,type:"Run",re:77},
  {d:"2026-01-13",dist:7.61,mt:2404,type:"Run",re:13},{d:"2026-01-14",dist:0,mt:1802,type:"HIIT",re:80},
  {d:"2026-01-15",dist:6.89,mt:2330,type:"Run",re:62},{d:"2026-01-16",dist:0,mt:1320,type:"Strength",re:6},
  {d:"2026-01-17",dist:0,mt:1538,type:"Strength",re:5},{d:"2026-01-21",dist:7.33,mt:2331,type:"Run",re:13},
  {d:"2026-01-22",dist:0,mt:3013,type:"HIIT",re:77},{d:"2026-01-23",dist:6.18,mt:2043,type:"Run",re:44},
  {d:"2026-01-26",dist:8.03,mt:2400,type:"Run",re:91},{d:"2026-01-27",dist:10.07,mt:3120,type:"Run",re:13},
  {d:"2026-01-28",dist:0,mt:2319,type:"HIIT",re:56},{d:"2026-01-30",dist:5.35,mt:1753,type:"Run",re:35},
  {d:"2026-01-30",dist:0,mt:862,type:"Strength",re:4},{d:"2026-02-02",dist:6.43,mt:1922,type:"Run",re:58},
  {d:"2026-02-03",dist:4.77,mt:1510,type:"Run",re:17},{d:"2026-02-04",dist:0,mt:2155,type:"Strength",re:8},
  {d:"2026-02-05",dist:10.02,mt:2637,type:"Run",re:175,name:"10k TT"},{d:"2026-02-08",dist:4.01,mt:1320,type:"Run",re:34},
  {d:"2026-02-12",dist:5.01,mt:1734,type:"Run",re:56},{d:"2026-02-13",dist:5.01,mt:1617,type:"Run",re:26},
  {d:"2026-02-16",dist:8.26,mt:2401,type:"Run",re:55},{d:"2026-02-17",dist:10.04,mt:3051,type:"Run",re:13},
  {d:"2026-02-18",dist:0,mt:2875,type:"HIIT",re:43},{d:"2026-02-19",dist:8.76,mt:2837,type:"Run",re:61},
  {d:"2026-02-20",dist:0,mt:3095,type:"HIIT",re:31},{d:"2026-02-23",dist:9.54,mt:2822,type:"Run",re:107},
  {d:"2026-02-24",dist:9.03,mt:3484,type:"Run",re:16},{d:"2026-02-25",dist:0,mt:2931,type:"HIIT",re:60},
  {d:"2026-02-26",dist:9.16,mt:2582,type:"Run",re:74},{d:"2026-03-01",dist:10.6,mt:3487,type:"Run",re:37},
  {d:"2026-03-02",dist:10.18,mt:3485,type:"Run",re:15},{d:"2026-03-03",dist:8.83,mt:2764,type:"Run",re:102},
  {d:"2026-03-04",dist:0,mt:3973,type:"HIIT",re:65},{d:"2026-03-05",dist:9.4,mt:2881,type:"Run",re:97},
  {d:"2026-03-06",dist:0,mt:2468,type:"HIIT",re:40},{d:"2026-03-08",dist:12.02,mt:3780,type:"Run",re:112},
  {d:"2026-03-09",dist:9.03,mt:2705,type:"Run",re:11},{d:"2026-03-10",dist:8.02,mt:2582,type:"Run",re:83},
  {d:"2026-03-11",dist:0,mt:2460,type:"HIIT",re:39},{d:"2026-03-12",dist:4.75,mt:1447,type:"Run",re:25},
  {d:"2026-03-13",dist:0,mt:2457,type:"HIIT",re:38},{d:"2026-03-15",dist:13.01,mt:3627,type:"Run",re:18},
  {d:"2026-03-16",dist:10.01,mt:3082,type:"Run",re:14},{d:"2026-03-17",dist:10.1,mt:2702,type:"Run",re:89},
  {d:"2026-03-18",dist:0,mt:2609,type:"HIIT",re:102},{d:"2026-03-19",dist:10.33,mt:2823,type:"Run",re:77},
  {d:"2026-03-20",dist:0,mt:2941,type:"HIIT",re:22},{d:"2026-03-21",dist:14.01,mt:3776,type:"Run",re:103},
  {d:"2026-03-23",dist:10.01,mt:3249,type:"Run",re:14},{d:"2026-03-25",dist:9.8,mt:2880,type:"Run",re:99},
  {d:"2026-03-26",dist:0,mt:2766,type:"HIIT",re:38},{d:"2026-03-27",dist:0,mt:2592,type:"HIIT",re:22},
  {d:"2026-03-28",dist:13.1,mt:4384,type:"Run",re:83},{d:"2026-03-30",dist:0,mt:2652,type:"HIIT",re:8},
  {d:"2026-03-31",dist:7.77,mt:2101,type:"Run",re:71},{d:"2026-04-01",dist:9.02,mt:2565,type:"Run",re:11},
  {d:"2026-04-02",dist:4.54,mt:1381,type:"Run",re:12},{d:"2026-04-04",dist:4.0,mt:1248,type:"Run",re:22},
  {d:"2026-04-05",dist:11.33,mt:4441,type:"Race",re:287,name:"HYROX Sim"},{d:"2026-04-07",dist:8.02,mt:2480,type:"Run",re:9},
  {d:"2026-04-08",dist:8.99,mt:2343,type:"Run",re:68},{d:"2026-04-09",dist:4.87,mt:1441,type:"Run",re:15},
  {d:"2026-04-09",dist:0,mt:990,type:"Strength",re:4},{d:"2026-04-10",dist:0,mt:4365,type:"HIIT",re:47},
  {d:"2026-04-11",dist:15.0,mt:4672,type:"Run",re:146},{d:"2026-04-13",dist:10.02,mt:2923,type:"Run",re:12},
  {d:"2026-04-14",dist:9.59,mt:2807,type:"Run",re:117},{d:"2026-04-15",dist:0,mt:2800,type:"HIIT",re:75},
  {d:"2026-04-16",dist:10.98,mt:3644,type:"Run",re:71},{d:"2026-04-17",dist:0,mt:2522,type:"HIIT",re:34},
  {d:"2026-04-18",dist:15.61,mt:5121,type:"Run",re:107},{d:"2026-04-20",dist:9.3,mt:2716,type:"Run",re:77},
  {d:"2026-04-21",dist:11.84,mt:3944,type:"Run",re:41},{d:"2026-04-22",dist:0,mt:759,type:"Strength",re:3},
  {d:"2026-04-22",dist:0,mt:2130,type:"HIIT",re:84},{d:"2026-04-23",dist:10.56,mt:3443,type:"Run",re:51},
  {d:"2026-04-24",dist:0,mt:1516,type:"HIIT",re:22},{d:"2026-04-26",dist:9.38,mt:3151,type:"Run",re:39},
  {d:"2026-04-27",dist:12.51,mt:4162,type:"Run",re:25},{d:"2026-04-28",dist:9.55,mt:2767,type:"Run",re:103},
  {d:"2026-04-29",dist:0,mt:2722,type:"HIIT",re:49},{d:"2026-05-05",dist:9.28,mt:3043,type:"Run",re:38},
  {d:"2026-05-06",dist:8.69,mt:2465,type:"Run",re:119},{d:"2026-05-07",dist:7.01,mt:2447,type:"Run",re:18},
  {d:"2026-05-08",dist:0,mt:2867,type:"HIIT",re:34},{d:"2026-05-09",dist:9.29,mt:2854,type:"Run",re:83},
  {d:"2026-05-11",dist:6.49,mt:1952,type:"Run",re:49},{d:"2026-05-12",dist:8.12,mt:2905,type:"Run",re:14},
  {d:"2026-05-13",dist:0,mt:2895,type:"HIIT",re:22},{d:"2026-05-14",dist:5.18,mt:1738,type:"Run",re:25},
  {d:"2026-05-15",dist:4.23,mt:1383,type:"Run",re:25},
  {d:"2026-05-16",dist:12.14,mt:4773,type:"Race",re:314,name:"HYROX 1:19:26"},
  {d:"2026-05-18",dist:6.34,mt:2108,type:"Run",re:28},{d:"2026-05-19",dist:6.04,mt:2014,type:"Run",re:38},
  {d:"2026-05-20",dist:0,mt:3459,type:"Strength",re:7},{d:"2026-05-22",dist:10.83,mt:3653,type:"Run",re:42},
  {d:"2026-05-24",dist:15.01,mt:4980,type:"Run",re:73},{d:"2026-05-25",dist:0,mt:3078,type:"Strength",re:10},
  {d:"2026-05-26",dist:9.7,mt:2988,type:"Run",re:79},{d:"2026-05-27",dist:11.01,mt:3787,type:"Run",re:20},
  {d:"2026-05-28",dist:5.59,mt:2364,type:"Run",re:42},{d:"2026-05-29",dist:9.01,mt:3042,type:"Run",re:25},
  {d:"2026-05-31",dist:15.16,mt:5558,type:"Run",re:129},{d:"2026-06-01",dist:9.73,mt:3374,type:"Run",re:19},
  {d:"2026-06-02",dist:0,mt:2123,type:"HIIT",re:36},{d:"2026-06-03",dist:10.42,mt:3261,type:"Run",re:78},
  {d:"2026-06-04",dist:0,mt:2587,type:"Strength",re:6},{d:"2026-06-05",dist:9.76,mt:3321,type:"Run",re:17},
  {d:"2026-06-08",dist:4.44,mt:2685,type:"Run",re:74},{d:"2026-06-09",dist:4.85,mt:1596,type:"Run",re:51},
  {d:"2026-06-11",dist:5.06,mt:1725,type:"Run",re:10},
  {d:"2026-06-13",dist:6.59,mt:3664,type:"Race",re:261,name:"Sprint 2nd AG"},
  {d:"2026-06-15",dist:8.91,mt:3039,type:"Run",re:16},{d:"2026-06-16",dist:0,mt:2886,type:"Strength",re:6},
  {d:"2026-06-17",dist:10.7,mt:3258,type:"Run",re:87},{d:"2026-06-19",dist:7.82,mt:2527,type:"Run",re:45},
  {d:"2026-06-22",dist:0,mt:2509,type:"Strength",re:8},{d:"2026-06-23",dist:5.17,mt:1729,type:"Run",re:14},
  {d:"2026-06-24",dist:9.28,mt:2699,type:"Run",re:99},{d:"2026-06-25",dist:11.01,mt:3620,type:"Run",re:57},
  {d:"2026-06-26",dist:0,mt:2513,type:"HIIT",re:29},
  {d:"2026-06-27",dist:15.0,mt:8288,type:"Run",re:137,name:"Grand Brule 769m"},
  {d:"2026-06-29",dist:15.67,mt:5365,type:"Run",re:84},{d:"2026-06-30",dist:0,mt:3303,type:"Strength",re:6},
  {d:"2026-07-01",dist:10.11,mt:2999,type:"Run",re:106,name:"5x1km"},
  {d:"2026-07-02",dist:0,mt:2997,type:"HIIT",re:18},
  {d:"2026-07-03",dist:8.94,mt:2862,type:"Run",re:55},
  {d:"2026-07-03",dist:0,mt:4570,type:"HIIT",re:57,name:"Hockey"},
  {d:"2026-07-05",dist:17.49,mt:5750,type:"Run",re:219,name:"Long run 17.5km"},
  {d:"2026-07-06",dist:8.96,mt:3068,type:"Run",re:19},
  {d:"2026-07-07",dist:10.05,mt:2904,type:"Run",re:97},
  {d:"2026-07-08",dist:0,mt:3187,type:"Strength",re:9},
  {d:"2026-07-09",dist:6.28,mt:2572,type:"Run",re:55,name:"Hills 234m"},
  {d:"2026-07-10",dist:0,mt:3430,type:"HIIT",re:28},
  {d:"2026-07-12",dist:20.01,mt:6349,type:"Run",re:276,name:"20km long run"},
  {d:"2026-07-13",dist:6.99,mt:2424,type:"Run",re:11},
  {d:"2026-07-14",dist:0,mt:3605,type:"Strength",re:8},
  {d:"2026-07-15",dist:3.32,mt:1057,type:"Run",re:17},
  {d:"2026-07-16",dist:8.54,mt:2599,type:"Run",re:60,name:"2x2"},
  {d:"2026-07-17",dist:0,mt:2723,type:"HIIT",re:30},
  {d:"2026-07-17",dist:0,mt:4086,type:"HIIT",re:56,name:"Hockey"},
  {d:"2026-07-19",dist:14.06,mt:4510,type:"Run",re:96},
  {d:"2026-07-21",dist:12.0,mt:3993,type:"Run",re:81},
  {d:"2026-07-22",dist:4.47,mt:2314,type:"Run",re:18,name:"Hike 173m"},
  {d:"2026-07-22",dist:0,mt:2441,type:"Strength",re:16},
  {d:"2026-07-23",dist:13.21,mt:3918,type:"Run",re:140,name:"4x2km"}
];

const RACES = [
  {date:"2026-09-06",name:"HYROX Doubles Sim",goal:"Training race",color:"#ED8936"},
  {date:"2026-08-22",name:"Spartan Super",goal:"Sub 1:30 · clean obstacles",color:"#E53E3E"},
  {date:"2026-09-20",name:"Half Marathon",goal:"Sub 1:35 · controlled HR",color:"#9F7AEA"},
  {date:"2026-10-17",name:"Spartan Beast",goal:"Top 10 AG · all obstacles",color:"#E53E3E"},
];

const GARMIN_DYNAMICS = [
  {date:"May 16",session:"HYROX Race",vr:11.3,gct:329,cad:165,stride:1.0,vo:9.2},
  {date:"May 18",session:"Easy run",vr:8.0,gct:267,cad:168,stride:1.08,vo:8.6},
  {date:"Jun 3",session:"Speed pyramid",vr:7.5,gct:251,cad:165,stride:1.12,vo:8.4},
  {date:"Jun 5",session:"Easy Z2",vr:8.0,gct:278,cad:168,stride:1.05,vo:8.6},
  {date:"Jun 17",session:"Threshold",vr:7.8,gct:260,cad:170,stride:1.1,vo:8.5},
  {date:"Jun 24",session:"Quality run",vr:7.6,gct:255,cad:172,stride:1.13,vo:8.3},
];

function buildPMC() {
  const byDate = {};
  RAW.forEach(a => {
    byDate[a.d] = (byDate[a.d] || 0) + (a.re || 0);
  });
  const data = [];
  let ctl = 42, atl = 40;
  const kCTL = 2 / 43, kATL = 2 / 8;
  const start = new Date("2026-01-01");
  const end = new Date("2026-07-23");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const ds = d.toISOString().split("T")[0];
    const dailyTSS = byDate[ds] || 0;
    ctl = ctl * (1 - kCTL) + dailyTSS * kCTL;
    atl = atl * (1 - kATL) + dailyTSS * kATL;
    const tsb = ctl - atl;
    const label = ds.slice(5);
    data.push({ date: ds, label, tss: Math.round(dailyTSS), ctl: +ctl.toFixed(1), atl: +atl.toFixed(1), tsb: +tsb.toFixed(1) });
  }
  return data;
}

function buildWeeklyVol() {
  const weeks = {};
  RAW.filter(a => a.type === "Run" || a.type === "Race").forEach(a => {
    const d = new Date(a.d);
    const day = d.getDay();
    const mon = new Date(d);
    mon.setDate(d.getDate() - ((day + 6) % 7));
    const wk = mon.toISOString().split("T")[0];
    weeks[wk] = (weeks[wk] || 0) + a.dist;
  });
  return Object.keys(weeks).sort().map(w => ({ week: w.slice(5), km: +weeks[w].toFixed(1) }));
}

const today = new Date("2026-07-23");

function daysTo(dateStr) {
  return Math.max(0, Math.round((new Date(dateStr) - today) / 86400000));
}

const C = {
  bg: "#0f1117", card: "#1a1f2e", border: "#2d3748",
  text: "#e2e8f0", muted: "#718096", dim: "#4a5568",
  blue: "#4299E1", orange: "#ED8936", green: "#48BB78",
  red: "#E53E3E", purple: "#9F7AEA", teal: "#38B2AC"
};

function StatCard({ label, value, sub, color = C.blue, small = false }) {
  return (
    <div style={{ background: C.card, borderRadius: 12, padding: "14px 16px", border: `0.5px solid ${C.border}` }}>
      <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: small ? 18 : 22, fontWeight: 500, color }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 500, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, paddingBottom: 8, borderBottom: `0.5px solid ${C.border}` }}>
      {title}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11 }}>
      <div style={{ color: C.muted, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: "flex", gap: 8 }}>
          <span>{p.name}:</span><span style={{ fontWeight: 500 }}>{typeof p.value === "number" ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const pmc = buildPMC();
  const weeklyVol = buildWeeklyVol();
  const latest = pmc[pmc.length - 1];
  const prev7 = pmc[pmc.length - 8];

  const tsbNow = latest.tsb;
  let tsbLabel = "neutral", tsbColor = C.orange;
  if (tsbNow > 15) { tsbLabel = "very fresh"; tsbColor = C.green; }
  else if (tsbNow > 5) { tsbLabel = "fresh"; tsbColor = "#68D391"; }
  else if (tsbNow < -20) { tsbLabel = "very fatigued"; tsbColor = C.red; }
  else if (tsbNow < -5) { tsbLabel = "fatigued"; tsbColor = "#FC8181"; }

  const ctlTrend = latest.ctl > prev7.ctl;
  const weekRunKm = RAW.filter(a => {
    const diff = (today - new Date(a.d)) / 86400000;
    return diff <= 7 && (a.type === "Run" || a.type === "Race");
  }).reduce((s, a) => s + a.dist, 0);

  const pmcEvery3 = pmc.filter((_, i) => i % 3 === 0);

  const [activeTab, setActiveTab] = useState("pmc");
  const tabs = [
    { id: "pmc", label: "PMC" },
    { id: "volume", label: "Volume" },
    { id: "dynamics", label: "Dynamics" },
    { id: "races", label: "Races" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: 16, fontFamily: "system-ui, sans-serif", color: C.text, boxSizing: "border-box" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: `0.5px solid ${C.border}` }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>Rob Malloff</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Spartan Trifecta 2026 · HYROX AG22 · Orléans ON</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: C.muted }}>Season data</div>
            <div style={{ fontSize: 12, color: C.blue }}>Jan – Jul 2026</div>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ marginBottom: 24 }}>
          <SectionHeader title="Current status" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
            <StatCard label="CTL fitness" value={latest.ctl.toFixed(1)} sub="target 80–85 for Beast" color={C.blue} />
            <StatCard label="ATL fatigue" value={latest.atl.toFixed(1)} sub="7-day load" color={C.orange} />
            <StatCard label="TSB / form" value={latest.tsb.toFixed(1)} sub={tsbLabel} color={tsbColor} />
            <StatCard label="Week km" value={weekRunKm.toFixed(1) + "km"} sub="target 55–65km" color={C.text} />
            <StatCard label="CTL trend" value={(ctlTrend ? "↑ " : "↓ ") + (ctlTrend ? "building" : "declining")} sub="vs 7 days ago" color={ctlTrend ? C.green : "#FC8181"} />
          </div>
        </div>

        {/* Race countdown */}
        <div style={{ marginBottom: 24 }}>
          <SectionHeader title="Race countdown" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
            {RACES.map(r => {
              const days = daysTo(r.date);
              return (
                <div key={r.date} style={{ background: C.card, borderRadius: 12, padding: "14px 16px", border: `0.5px solid ${days < 30 ? r.color : C.border}` }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{r.date}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: C.text }}>{r.name}</div>
                  <div style={{ fontSize: 30, fontWeight: 500, color: r.color, lineHeight: 1 }}>
                    {days}<span style={{ fontSize: 12, color: C.muted, marginLeft: 3 }}>days</span>
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>{r.goal}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: `0.5px solid ${C.border}`, paddingBottom: 0 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: "transparent", border: "none", padding: "8px 14px", cursor: "pointer",
                fontSize: 12, fontWeight: 500, color: activeTab === t.id ? C.blue : C.muted,
                borderBottom: activeTab === t.id ? `2px solid ${C.blue}` : "2px solid transparent",
                marginBottom: -1, borderRadius: 0
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* PMC Tab */}
        {activeTab === "pmc" && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 11, flexWrap: "wrap" }}>
              {[["CTL fitness", C.blue], ["ATL fatigue", C.orange], ["TSB form", C.green]].map(([l, c]) => (
                <span key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 20, height: 2, background: c, display: "inline-block", borderRadius: 1 }} />
                  <span style={{ color: C.muted }}>{l}</span>
                </span>
              ))}
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={pmcEvery3} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: C.muted }} tickLine={false} interval={9} />
                  <YAxis yAxisId="main" tick={{ fontSize: 9, fill: C.muted }} tickLine={false} />
                  <YAxis yAxisId="tss" orientation="right" tick={{ fontSize: 9, fill: C.muted }} tickLine={false} domain={[0, 400]} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine yAxisId="main" y={0} stroke={C.border} strokeDasharray="2 2" />
                  <Bar yAxisId="tss" dataKey="tss" fill={C.muted} opacity={0.3} name="Daily TSS" radius={[2, 2, 0, 0]} />
                  <Line yAxisId="main" type="monotone" dataKey="ctl" stroke={C.blue} strokeWidth={2} dot={false} name="CTL" />
                  <Line yAxisId="main" type="monotone" dataKey="atl" stroke={C.orange} strokeWidth={2} dot={false} name="ATL" />
                  <Line yAxisId="main" type="monotone" dataKey="tsb" stroke={C.green} strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="TSB" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 16 }}>
              {[
                {label:"Peak CTL", value: Math.max(...pmc.map(p=>p.ctl)).toFixed(1), color: C.blue},
                {label:"Current ATL", value: latest.atl.toFixed(1), color: C.orange},
                {label:"Form today", value: latest.tsb.toFixed(1), color: tsbColor},
              ].map(s => <StatCard key={s.label} label={s.label} value={s.value} color={s.color} small />)}
            </div>
          </div>
        )}

        {/* Volume Tab */}
        {activeTab === "volume" && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 11, flexWrap: "wrap" }}>
              {[["≥55km target zone", C.green],["40–55km building", C.blue],["<40km base", C.border]].map(([l,c])=>(
                <span key={l} style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{width:10,height:10,background:c,borderRadius:2,display:"inline-block"}}/>
                  <span style={{color:C.muted}}>{l}</span>
                </span>
              ))}
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVol} margin={{ top: 5, right: 10, bottom: 20, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 9, fill: C.muted }} tickLine={false} angle={-45} textAnchor="end" interval={1} />
                  <YAxis tick={{ fontSize: 9, fill: C.muted }} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={55} stroke={C.green} strokeDasharray="4 2" strokeOpacity={0.6} />
                  <Bar dataKey="km" name="Weekly km" radius={[3, 3, 0, 0]}
                    fill={C.blue}
                    label={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 16 }}>
              {[
                {label:"Peak week", value: Math.max(...weeklyVol.map(w=>w.km)).toFixed(1)+"km", color: C.green},
                {label:"Avg week", value: (weeklyVol.reduce((s,w)=>s+w.km,0)/weeklyVol.length).toFixed(1)+"km", color: C.blue},
                {label:"Total Jan–Jun", value: Math.round(RAW.filter(a=>a.type==="Run"||a.type==="Race").reduce((s,a)=>s+a.dist,0))+"km", color: C.text},
              ].map(s => <StatCard key={s.label} label={s.label} value={s.value} color={s.color} small />)}
            </div>
          </div>
        )}

        {/* Dynamics Tab */}
        {activeTab === "dynamics" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                {key:"vr", label:"Vertical ratio (%)", baseline:8.4, color:C.blue, good:"lower"},
                {key:"gct", label:"Ground contact time (ms)", baseline:267, color:C.orange, good:"lower"},
                {key:"cad", label:"Cadence (spm)", baseline:168, color:C.green, good:"higher"},
                {key:"stride", label:"Stride length (m)", baseline:1.08, color:C.purple, good:"higher"},
              ].map(m => (
                <div key={m.key}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>{m.label}</div>
                  <div style={{ height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={GARMIN_DYNAMICS} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 8, fill: C.muted }} tickLine={false} />
                        <YAxis tick={{ fontSize: 8, fill: C.muted }} tickLine={false} domain={["auto","auto"]} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={m.baseline} stroke={m.color} strokeDasharray="4 2" strokeOpacity={0.5} />
                        <Line type="monotone" dataKey={m.key} stroke={m.color} strokeWidth={2} dot={{ r: 4, fill: m.color }} name={m.label} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>
                    baseline: {m.baseline} · latest: {GARMIN_DYNAMICS[GARMIN_DYNAMICS.length-1][m.key]}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: 12, background: C.card, borderRadius: 8, border: `0.5px solid ${C.border}`, fontSize: 11, color: C.muted }}>
              Data from Garmin 965 running dynamics. Dashed line = baseline reference. Trend shows improvement since HYROX race (May 16).
            </div>
          </div>
        )}

        {/* Races Tab */}
        {activeTab === "races" && (
          <div>
            <SectionHeader title="2026 results" />
            {[
              {name:"HYROX Solo",date:"May 16",time:"1:19:26",detail:"Rank 22 AG · Wall balls rank 522 · Burpee BJ rank 5",color:C.orange},
              {name:"Spartan Sprint",date:"Jun 13",time:"1:08:52",detail:"2nd AG (2/98) · 20th overall (875) · Spear miss + queueing cost ~5min",color:C.green},
            ].map(r => (
              <div key={r.name} style={{ background: C.card, borderRadius: 12, padding: "14px 16px", border: `0.5px solid ${r.color}`, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14, color: C.text }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{r.date} · {r.detail}</div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: r.color }}>{r.time}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <SectionHeader title="2025 reference" />
              <div style={{ background: C.card, borderRadius: 12, padding: "14px 16px", border: `0.5px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14, color: C.text }}>Spartan Super — Calabogie</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Aug 23 2025 · 10th AG (10/118) · 45th overall (1062) · 24/27 obstacles</div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: C.muted }}>1:56:36</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: 12, background: C.card, borderRadius: 8, border: `0.5px solid ${C.border}`, fontSize: 11, color: C.muted }}>
              HYROX weaknesses: Wall balls (rank 522) · Sled push (rank 176) · Sandbag lunges (rank 118). Strength: Burpee BJ (rank 5).
              Super target: sub 1:30, spear throw clean. Beast target: top 10 AG, all obstacles complete.
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 24, padding: "10px 14px", background: C.card, borderRadius: 8, border: `0.5px solid ${C.border}`, fontSize: 10, color: C.dim }}>
          {RAW.length} Strava activities · Jan–Jul 2026 · TSS from Strava relative effort · Dynamics from Garmin 965 · Built Jun 2026
        </div>
      </div>
    </div>
  );
}
