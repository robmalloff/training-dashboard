import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, ScatterChart, Scatter, ComposedChart } from "recharts";

const RAW = [
  {d:"2026-01-02",dist:7.03,mt:2289,type:"Run",re:38,name:"Base"},
  {d:"2026-01-05",dist:4.27,mt:1515,type:"Run",re:21,name:"VO2 Intervals + Tempo Float"},
  {d:"2026-01-06",dist:0.0,mt:2276,type:"Strength",re:26,name:"Strength"},
  {d:"2026-01-06",dist:6.01,mt:1903,type:"Run",re:31,name:"Base"},
  {d:"2026-01-07",dist:0.0,mt:934,type:"HIIT",re:18,name:"Coherence"},
  {d:"2026-01-07",dist:0.0,mt:1786,type:"HIIT",re:35,name:"HIIT"},
  {d:"2026-01-08",dist:7.47,mt:2508,type:"Run",re:35,name:"Threshold 1"},
  {d:"2026-01-09",dist:0.0,mt:1767,type:"HIIT",re:34,name:"HIIT"},
  {d:"2026-01-12",dist:0.0,mt:663,type:"HIIT",re:13,name:"Tranquility"},
  {d:"2026-01-12",dist:8.28,mt:2449,type:"Run",re:40,name:"Progressive Threshold"},
  {d:"2026-01-13",dist:0.0,mt:687,type:"HIIT",re:13,name:"Tranquility"},
  {d:"2026-01-13",dist:7.61,mt:2397,type:"Run",re:39,name:"Z2"},
  {d:"2026-01-14",dist:0.0,mt:1801,type:"HIIT",re:35,name:"HIIT"},
  {d:"2026-01-15",dist:6.89,mt:2215,type:"Run",re:36,name:"VO2 Intervals + Tempo Float"},
  {d:"2026-01-16",dist:0.0,mt:1320,type:"Strength",re:15,name:"Strength"},
  {d:"2026-01-17",dist:0.0,mt:1538,type:"Strength",re:18,name:"Strength"},
  {d:"2026-01-19",dist:3.82,mt:2296,type:"Race",re:68,name:"Ottawa - Threshold 3X10"},
  {d:"2026-01-21",dist:7.33,mt:2329,type:"Run",re:38,name:"Z2"},
  {d:"2026-01-22",dist:0.0,mt:2551,type:"HIIT",re:50,name:"HIIT"},
  {d:"2026-01-23",dist:6.18,mt:1991,type:"Run",re:33,name:"VO2 Intervals (2X6) + Tempo Floa"},
  {d:"2026-01-24",dist:0.0,mt:664,type:"HIIT",re:13,name:"Tranquility"},
  {d:"2026-01-26",dist:8.03,mt:2390,type:"Run",re:39,name:"Threshold 2X12"},
  {d:"2026-01-27",dist:10.07,mt:3115,type:"Run",re:51,name:"Z2"},
  {d:"2026-01-28",dist:0.0,mt:2222,type:"HIIT",re:43,name:"HIIT"},
  {d:"2026-01-29",dist:0.0,mt:663,type:"HIIT",re:13,name:"Tranquility"},
  {d:"2026-01-30",dist:0.0,mt:862,type:"Strength",re:10,name:"Strength"},
  {d:"2026-01-30",dist:5.35,mt:1678,type:"Run",re:28,name:"Treadmill Running"},
  {d:"2026-02-02",dist:6.43,mt:1889,type:"Run",re:31,name:"Threshold 2X12"},
  {d:"2026-02-03",dist:4.77,mt:1454,type:"Run",re:24,name:"VO2 Intervals (5X1)"},
  {d:"2026-02-04",dist:0.0,mt:2155,type:"Strength",re:25,name:"Strength"},
  {d:"2026-02-05",dist:10.02,mt:2634,type:"Race",re:78,name:"10km TT"},
  {d:"2026-02-08",dist:4.01,mt:1310,type:"Run",re:21,name:"Treadmill Running"},
  {d:"2026-02-12",dist:5.01,mt:1642,type:"Run",re:27,name:"Treadmill Running"},
  {d:"2026-02-13",dist:5.01,mt:1611,type:"Run",re:26,name:"Treadmill Running"},
  {d:"2026-02-16",dist:8.26,mt:2383,type:"Run",re:39,name:"Threshold 2X12"},
  {d:"2026-02-17",dist:10.04,mt:3048,type:"Run",re:50,name:"Z2"},
  {d:"2026-02-18",dist:0.0,mt:2874,type:"HIIT",re:56,name:"HIIT"},
  {d:"2026-02-19",dist:8.76,mt:2762,type:"Run",re:45,name:"VO2 Intervals (2X6) + Tempo Floa"},
  {d:"2026-02-20",dist:0.0,mt:3094,type:"HIIT",re:60,name:"HIIT"},
  {d:"2026-02-23",dist:9.54,mt:2778,type:"Run",re:46,name:"Threshold 3X10"},
  {d:"2026-02-24",dist:9.03,mt:3477,type:"Run",re:49,name:"Z2"},
  {d:"2026-02-25",dist:0.0,mt:2930,type:"HIIT",re:57,name:"HIIT"},
  {d:"2026-02-26",dist:9.16,mt:2488,type:"Run",re:48,name:"VO2 Intervals (9X1)+ Tempo Float"},
  {d:"2026-03-01",dist:10.6,mt:3473,type:"Run",re:57,name:"Z2"},
  {d:"2026-03-02",dist:10.18,mt:3481,type:"Run",re:49,name:"Z2"},
  {d:"2026-03-03",dist:8.83,mt:2746,type:"Run",re:45,name:"Threshold 2X15"},
  {d:"2026-03-04",dist:0.0,mt:3972,type:"HIIT",re:77,name:"HIIT"},
  {d:"2026-03-05",dist:9.4,mt:2813,type:"Run",re:46,name:"VO2 Intervals (3X5) + Tempo Floa"},
  {d:"2026-03-06",dist:0.0,mt:2070,type:"HIIT",re:40,name:"HIIT"},
  {d:"2026-03-08",dist:12.02,mt:3775,type:"Race",re:112,name:"Ottawa - Z2"},
  {d:"2026-03-09",dist:9.03,mt:2703,type:"Run",re:44,name:"Z2"},
  {d:"2026-03-10",dist:8.02,mt:2530,type:"Run",re:41,name:"Threshold 3X8"},
  {d:"2026-03-11",dist:0.0,mt:2460,type:"HIIT",re:48,name:"HIIT"},
  {d:"2026-03-12",dist:4.75,mt:1382,type:"Run",re:23,name:"VO2 Intervals (90sX5) + Tempo Fl"},
  {d:"2026-03-13",dist:0.0,mt:2457,type:"HIIT",re:48,name:"HIIT"},
  {d:"2026-03-15",dist:13.01,mt:3618,type:"Run",re:70,name:"Run Workout"},
  {d:"2026-03-16",dist:10.01,mt:3078,type:"Run",re:50,name:"Z2"},
  {d:"2026-03-17",dist:10.1,mt:2675,type:"Run",re:52,name:"Threshold 2X15"},
  {d:"2026-03-18",dist:0.0,mt:2609,type:"HIIT",re:51,name:"HIIT"},
  {d:"2026-03-19",dist:10.33,mt:2738,type:"Run",re:53,name:"VO2 Intervals (4X4) + Tempo Floa"},
  {d:"2026-03-20",dist:0.0,mt:2941,type:"HIIT",re:57,name:"HIIT"},
  {d:"2026-03-21",dist:14.01,mt:3762,type:"Run",re:73,name:"Run Workout"},
  {d:"2026-03-23",dist:10.01,mt:3246,type:"Run",re:53,name:"Z2"},
  {d:"2026-03-25",dist:9.8,mt:2877,type:"Race",re:85,name:"Ottawa - Threshold Steady"},
  {d:"2026-03-26",dist:0.0,mt:2766,type:"HIIT",re:54,name:"HIIT"},
  {d:"2026-03-27",dist:0.0,mt:2592,type:"HIIT",re:50,name:"HIIT"},
  {d:"2026-03-28",dist:13.1,mt:4379,type:"Race",re:130,name:"Ottawa - Run Workout"},
  {d:"2026-03-30",dist:0.0,mt:2651,type:"HIIT",re:52,name:"HIIT"},
  {d:"2026-03-31",dist:7.77,mt:2058,type:"Run",re:40,name:"Threshold 2X10"},
  {d:"2026-04-01",dist:9.02,mt:2562,type:"Run",re:50,name:"Treadmill Running"},
  {d:"2026-04-02",dist:4.54,mt:1336,type:"Run",re:22,name:"VO2 Intervals (90sX5) + Tempo Fl"},
  {d:"2026-04-04",dist:4.0,mt:1251,type:"Race",re:37,name:"Ottawa Running"},
  {d:"2026-04-05",dist:11.33,mt:3935,type:"HIIT",re:77,name:"ROXFIT(83)"},
  {d:"2026-04-07",dist:8.02,mt:2477,type:"Run",re:41,name:"Z2"},
  {d:"2026-04-08",dist:8.99,mt:2320,type:"Run",re:45,name:"Threshold 2X10"},
  {d:"2026-04-09",dist:0.0,mt:990,type:"Strength",re:11,name:"Strength"},
  {d:"2026-04-09",dist:4.87,mt:1395,type:"Run",re:27,name:"VO2 Intervals (90sX5) + Tempo Fl"},
  {d:"2026-04-10",dist:0.0,mt:3239,type:"HIIT",re:63,name:"HIIT"},
  {d:"2026-04-11",dist:15.01,mt:4664,type:"Race",re:139,name:"Ottawa - Z2"},
  {d:"2026-04-13",dist:10.02,mt:2917,type:"Run",re:48,name:"Z2"},
  {d:"2026-04-14",dist:0.0,mt:3704,type:"Strength",re:42,name:"Yoga"},
  {d:"2026-04-14",dist:9.59,mt:2804,type:"Race",re:83,name:"Ottawa - Threshold 2X10"},
  {d:"2026-04-15",dist:0.0,mt:2799,type:"HIIT",re:54,name:"HIIT"},
  {d:"2026-04-16",dist:10.98,mt:3644,type:"Race",re:108,name:"Ottawa - Run Workout"},
  {d:"2026-04-17",dist:0.0,mt:2522,type:"HIIT",re:49,name:"HIIT"},
  {d:"2026-04-18",dist:15.61,mt:5116,type:"Race",re:152,name:"Ottawa Running"},
  {d:"2026-04-20",dist:9.3,mt:2710,type:"Race",re:81,name:"Ottawa - Threshold Progressive"},
  {d:"2026-04-21",dist:11.84,mt:3941,type:"Race",re:117,name:"Ottawa - Z2"},
  {d:"2026-04-22",dist:0.0,mt:2130,type:"HIIT",re:41,name:"HIIT"},
  {d:"2026-04-22",dist:0.0,mt:759,type:"Strength",re:9,name:"Strength"},
  {d:"2026-04-23",dist:10.56,mt:3439,type:"Race",re:102,name:"Ottawa - Run Workout"},
  {d:"2026-04-24",dist:0.0,mt:1496,type:"HIIT",re:29,name:"HIIT"},
  {d:"2026-04-26",dist:9.38,mt:3130,type:"Race",re:93,name:"Ottawa Running"},
  {d:"2026-04-27",dist:12.51,mt:4159,type:"Race",re:124,name:"Ottawa Running"},
  {d:"2026-04-28",dist:9.55,mt:2763,type:"Race",re:82,name:"Ottawa - Threshold 2X10"},
  {d:"2026-04-29",dist:0.0,mt:2721,type:"HIIT",re:53,name:"HIIT"},
  {d:"2026-04-30",dist:0.0,mt:1951,type:"HIIT",re:38,name:"Indoor Cycling"},
  {d:"2026-05-01",dist:0.0,mt:2915,type:"HIIT",re:57,name:"HIIT"},
  {d:"2026-05-04",dist:0.0,mt:2606,type:"HIIT",re:51,name:"HIIT"},
  {d:"2026-05-05",dist:9.28,mt:3040,type:"Race",re:90,name:"Ottawa - Z2"},
  {d:"2026-05-06",dist:8.69,mt:2461,type:"Race",re:73,name:"Ottawa - Threshold Progressive"},
  {d:"2026-05-07",dist:7.01,mt:2445,type:"Race",re:73,name:"Ottawa Running"},
  {d:"2026-05-08",dist:0.0,mt:2866,type:"HIIT",re:56,name:"HIIT"},
  {d:"2026-05-09",dist:9.29,mt:2849,type:"Race",re:85,name:"Ottawa - Run Workout"},
  {d:"2026-05-11",dist:6.49,mt:1947,type:"Race",re:58,name:"Ottawa Running"},
  {d:"2026-05-12",dist:8.12,mt:2902,type:"Race",re:86,name:"Ottawa Running"},
  {d:"2026-05-13",dist:0.0,mt:2895,type:"HIIT",re:56,name:"HIIT"},
  {d:"2026-05-14",dist:5.18,mt:1735,type:"Race",re:52,name:"Ottawa - Run Workout"},
  {d:"2026-05-15",dist:4.23,mt:1381,type:"Race",re:41,name:"Ottawa - Run Workout"},
  {d:"2026-05-16",dist:12.14,mt:4030,type:"HIIT",re:78,name:"Indoor Running"},
  {d:"2026-05-18",dist:6.35,mt:2105,type:"Race",re:63,name:"Ottawa Running"},
  {d:"2026-05-19",dist:6.04,mt:1958,type:"Race",re:58,name:"Ottawa - W1 TUE — Threshold 3x2km"},
  {d:"2026-05-20",dist:0.0,mt:3458,type:"Strength",re:39,name:"Strength"},
  {d:"2026-05-22",dist:10.84,mt:3650,type:"Race",re:108,name:"Ottawa Running"},
  {d:"2026-05-24",dist:15.01,mt:4976,type:"Race",re:148,name:"Ottawa Running"},
  {d:"2026-05-25",dist:0.0,mt:3078,type:"Strength",re:35,name:"Strength"},
  {d:"2026-05-26",dist:9.7,mt:2998,type:"Race",re:89,name:"Ottawa - W2 TUE — Threshold 5x1km"},
  {d:"2026-05-27",dist:11.01,mt:3783,type:"Race",re:112,name:"Ottawa Running"},
  {d:"2026-05-28",dist:5.6,mt:2207,type:"Race",re:66,name:"Ottawa - W2 THU — Hill Intervals 6x1min"},
  {d:"2026-05-29",dist:9.01,mt:3040,type:"Race",re:90,name:"Ottawa Running"},
  {d:"2026-05-31",dist:15.16,mt:5522,type:"Run",re:77,name:"Montreal Running"},
  {d:"2026-06-01",dist:9.73,mt:3372,type:"Race",re:100,name:"Ottawa Running"},
  {d:"2026-06-02",dist:0.0,mt:2122,type:"HIIT",re:41,name:"HIIT"},
  {d:"2026-06-03",dist:10.42,mt:3275,type:"Race",re:97,name:"Ottawa - W2 WED — Speed Pyramid 400-600"},
  {d:"2026-06-04",dist:0.0,mt:2586,type:"Strength",re:29,name:"Strength"},
  {d:"2026-06-05",dist:9.77,mt:3318,type:"Race",re:99,name:"Ottawa Running"},
  {d:"2026-06-08",dist:4.44,mt:2502,type:"Race",re:74,name:"Potton Running"},
  {d:"2026-06-09",dist:4.85,mt:1593,type:"Race",re:47,name:"Potton Running"},
  {d:"2026-06-11",dist:5.06,mt:1723,type:"Race",re:51,name:"Ottawa Running"},
  {d:"2026-06-13",dist:6.59,mt:3771,type:"Run",re:53,name:"Mont-Tremblant Running"},
  {d:"2026-06-15",dist:8.91,mt:3034,type:"Race",re:90,name:"Ottawa Running"},
  {d:"2026-06-16",dist:0.0,mt:2886,type:"Strength",re:33,name:"Strength"},
  {d:"2026-06-17",dist:10.7,mt:3255,type:"Race",re:97,name:"Ottawa - W5 TUE — Easy Threshold Touch"},
  {d:"2026-06-18",dist:0.0,mt:2096,type:"HIIT",re:41,name:"Indoor Cycling"},
  {d:"2026-06-19",dist:7.82,mt:2524,type:"Race",re:75,name:"Ottawa Running"},
  {d:"2026-06-22",dist:0.0,mt:2509,type:"Strength",re:29,name:"Strength"},
  {d:"2026-06-23",dist:5.18,mt:1727,type:"Race",re:51,name:"Ottawa Running"},
  {d:"2026-06-24",dist:9.28,mt:2696,type:"Race",re:80,name:"Ottawa - W6 TUE — Threshold 5km Continu"},
  {d:"2026-06-25",dist:11.01,mt:3617,type:"Race",re:107,name:"Ottawa Running"},
  {d:"2026-06-26",dist:0.0,mt:2512,type:"HIIT",re:49,name:"HIIT"},
  {d:"2026-06-27",dist:15.0,mt:8029,type:"Run",re:112,name:"Mont-Tremblant Running"},
  {d:"2026-06-29",dist:15.67,mt:5360,type:"Run",re:75,name:"Mont-Tremblant Running"},
  {d:"2026-06-30",dist:0.0,mt:3303,type:"Strength",re:38,name:"Strength"},
  {d:"2026-07-01",dist:10.11,mt:2987,type:"Race",re:89,name:"Ottawa - W7 TUE — Threshold 5x1km"},
  {d:"2026-07-02",dist:0.0,mt:2997,type:"HIIT",re:58,name:"HIIT"},
  {d:"2026-07-03",dist:0.0,mt:4570,type:"HIIT",re:89,name:"Ice Hockey"},
  {d:"2026-07-03",dist:8.94,mt:2860,type:"Race",re:85,name:"Ottawa Running"},
  {d:"2026-07-05",dist:17.49,mt:5746,type:"Race",re:171,name:"Ottawa Running"},
  {d:"2026-07-06",dist:8.96,mt:3065,type:"Race",re:91,name:"Ottawa Running"},
  {d:"2026-07-07",dist:10.05,mt:2900,type:"Race",re:86,name:"Ottawa - W8 TUE — Threshold 6km Continu"},
  {d:"2026-07-08",dist:0.0,mt:3173,type:"Strength",re:36,name:"Strength"},
  {d:"2026-07-09",dist:6.28,mt:2391,type:"Race",re:71,name:"Ottawa - W8 THU — Uphill 8x1min"},
  {d:"2026-07-10",dist:0.0,mt:3343,type:"HIIT",re:65,name:"HIIT"},
  {d:"2026-07-12",dist:20.01,mt:6344,type:"Race",re:188,name:"Ottawa Running"},
  {d:"2026-07-13",dist:6.99,mt:2421,type:"Race",re:72,name:"Ottawa Running"},
  {d:"2026-07-14",dist:0.0,mt:3604,type:"Strength",re:41,name:"Strength"},
  {d:"2026-07-15",dist:0.0,mt:3632,type:"Strength",re:41,name:"Yoga"},
  {d:"2026-07-15",dist:3.32,mt:1053,type:"Race",re:31,name:"Ottawa Running"},
  {d:"2026-07-16",dist:8.54,mt:2592,type:"Race",re:77,name:"Ottawa Running"},
  {d:"2026-07-17",dist:0.0,mt:4086,type:"HIIT",re:80,name:"Ice Hockey"},
  {d:"2026-07-17",dist:0.0,mt:2328,type:"HIIT",re:45,name:"HIIT"},
  {d:"2026-07-19",dist:14.06,mt:4506,type:"Race",re:134,name:"Ottawa Running"},
  {d:"2026-07-21",dist:12.01,mt:3990,type:"Run",re:56,name:"Madawaska Valley Running"},
  {d:"2026-07-22",dist:0.0,mt:2441,type:"Strength",re:28,name:"Strength"},
  {d:"2026-07-22",dist:4.47,mt:2291,type:"Run",re:32,name:"Madawaska Valley Hiking"},
  {d:"2026-07-23",dist:13.21,mt:3924,type:"Race",re:117,name:"Ottawa - W10 TUE — Threshold 4x2km"},
  {d:"2026-07-24",dist:0.0,mt:3725,type:"HIIT",re:73,name:"Ice Hockey"},
  {d:"2026-07-26",dist:20.02,mt:6477,type:"Race",re:192,name:"Ottawa - W10 SUN — Trail Long Run 20km"},
  {d:"2026-07-27",dist:9.38,mt:3318,type:"Race",re:99,name:"Ottawa Running"},
  {d:"2026-07-31",dist:8.17,mt:2620,type:"Race",re:78,name:"Ottawa Running"},
  {d:"2026-08-02",dist:20.71,mt:6961,type:"Race",re:207,name:"Ottawa Running"},
  {d:"2026-08-03",dist:0.0,mt:2795,type:"Strength",re:32,name:"Strength"},
  {d:"2026-08-04",dist:7.13,mt:2422,type:"Race",re:72,name:"Ottawa Running"},
  {d:"2026-08-05",dist:0.0,mt:5985,type:"Strength",re:68,name:"Yoga"},
  {d:"2026-08-05",dist:8.68,mt:2694,type:"Race",re:80,name:"Ottawa - W11 TUE — Threshold 5x1km"},
  {d:"2026-08-06",dist:0.0,mt:1863,type:"HIIT",re:36,name:"Indoor Cycling"},
  {d:"2026-08-07",dist:0.0,mt:5113,type:"HIIT",re:100,name:"Ice Hockey"},
  {d:"2026-08-07",dist:5.06,mt:1624,type:"Race",re:48,name:"Ottawa Running"},
  {d:"2026-08-09",dist:6.94,mt:2083,type:"Race",re:62,name:"Ottawa Running"},
  {d:"2026-08-11",dist:5.02,mt:1221,type:"Race",re:36,name:"Ottawa - W12 TUE — 5km Time Trial"},
  {d:"2026-08-12",dist:0.0,mt:2097,type:"HIIT",re:41,name:"Indoor Cycling"},
  {d:"2026-08-13",dist:0.0,mt:2588,type:"Strength",re:29,name:"Strength"},
  {d:"2026-08-14",dist:5.08,mt:1595,type:"Race",re:47,name:"Ottawa Running"},
  {d:"2026-08-17",dist:8.19,mt:2745,type:"Race",re:82,name:"Ottawa Running"},
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
  const end = new Date("2026-08-17");
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

const today = new Date();

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
            <div style={{ fontSize: 12, color: C.blue }}>Jan – Aug 2026</div>
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
