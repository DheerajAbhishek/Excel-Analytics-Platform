import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "./UserContext";
import { Pie, Bar } from 'react-chartjs-2';
import './Charts.css';
import './head.css';
import Sidebar from './Sidebar';
import axios from 'axios';
import Plotly from 'plotly.js-dist';

export default function Charts() {
    const { excelData } = useContext(UserContext);
    const [chartType, setChartType] = useState("Bar");
    const [xAxisKey, setXAxisKey] = useState("");
    const [yAxisKey, setYAxisKey] = useState("");
    const [zAxisKey, setZAxisKey] = useState(""); // <-- New
    const [scriptLoaded, setScriptLoaded] = useState(false);

    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const labels = excelData ? Object.keys(excelData[0]) : [];
    const xLabels = excelData?.map(item => item[xAxisKey]);
    const yValues = excelData?.map(item => Number(item[yAxisKey]));
    const zValues = excelData?.map(item => Number(item[zAxisKey]));

    const chartData = {
        labels: xLabels,
        datasets: [
            {
                label: `${yAxisKey} vs ${xAxisKey}`,
                data: yValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
            }
        ]
    };

    useEffect(() => {
        if (excelData?.length && !window.puter) {
            const script = document.createElement("script");
            script.src = "https://js.puter.com/v2/";
            script.async = true;

            script.onload = () => setScriptLoaded(true);
            script.onerror = () => console.error("Failed to load AI script");

            document.body.appendChild(script);
            return () => document.body.removeChild(script);
        }
    }, [excelData]);

    const getai = () => {
        const summaryBox = document.getElementById("ai-analysis");

        if (!scriptLoaded || !window.puter) {
            summaryBox.innerText = "AI engine is not ready yet.";
            return;
        }

        summaryBox.innerText = "Analyzing data...";

        window.puter.ai.chat(
            `Analyze this spreadsheet data and give me a short summary with trends or patterns:\n${JSON.stringify(excelData.slice(0, 20))}`
        ).then((reply) => {
            summaryBox.innerText = reply;
        }).catch(err => {
            summaryBox.innerText = "Failed to load analysis.";
            console.error(err);
        });
    };

    const downloadChart = () => {
        if (chartRef.current) {
            const chart = chartRef.current;
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
            const imageUrl = chart.toBase64Image();
            const a = document.createElement("a");
            a.href = imageUrl;
            a.download = `${chartType}-chart.png`;
            a.click();
        } else {
            console.error("Chart reference is not available.");
        }
    };

    useEffect(() => {
        if (chartRef.current) {
            chartInstanceRef.current = chartRef.current.chartInstance;
        }
    }, [chartRef]);

    useEffect(() => {
        if (
            chartType === "3DScatter" &&
            xAxisKey &&
            yAxisKey &&
            zAxisKey &&
            excelData?.length
        ) {
            const xValues = excelData.map(item => item[xAxisKey]);
            const yValues = excelData.map(item => Number(item[yAxisKey]));
            const zValues = excelData.map(item => Number(item[zAxisKey]));

            const trace = {
                type: 'scatter3d',
                mode: 'markers',
                x: xValues,
                y: yValues,
                z: zValues,
                marker: {
                    size: 5,
                    color: zValues,
                    colorscale: 'Viridis'
                }
            };

            const layout = {
                margin: { l: 0, r: 0, b: 0, t: 0 },
                scene: {
                    xaxis: { title: xAxisKey },
                    yaxis: { title: yAxisKey },
                    zaxis: { title: zAxisKey }
                }
            };

            Plotly.newPlot('plotly-chart', [trace], layout);
        }
    }, [chartType, xAxisKey, yAxisKey, zAxisKey, excelData]);

    return (
        <>
            <div className="head">
                <h1 className="heading">📊 Data Analysis</h1>
            </div>
            <Sidebar />

            <div className="charts">
                <div className="card">
                    <h4>Select Chart Type</h4>
                    <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                        <option value="Bar">Bar Chart</option>
                        <option value="Pie">Pie Chart</option>
                        <option value="3DScatter">3D Scatter Chart</option>
                    </select>

                    <h4>Select X-Axis</h4>
                    <select value={xAxisKey} onChange={(e) => setXAxisKey(e.target.value)}>
                        <option value="">X-axis</option>
                        {labels.map((label, index) => (
                            <option key={index} value={label}>{label}</option>
                        ))}
                    </select>

                    <h4>Select Y-Axis</h4>
                    <select value={yAxisKey} onChange={(e) => setYAxisKey(e.target.value)}>
                        <option value="">Y-axis</option>
                        {labels.map((label, index) => (
                            <option key={index} value={label}>{label}</option>
                        ))}
                    </select>

                    {chartType === "3DScatter" && (
                        <>
                            <h4>Select Z-Axis</h4>
                            <select value={zAxisKey} onChange={(e) => setZAxisKey(e.target.value)}>
                                <option value="">Z-axis</option>
                                {labels.map((label, index) => (
                                    <option key={index} value={label}>{label}</option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                <div className="chart-preview">
                    <h4>🔍 Chart Preview</h4>

                    {chartType === "Bar" ? (
                        <Bar ref={chartRef} data={chartData} />
                    ) : chartType === "Pie" ? (
                        <Pie ref={chartRef} data={chartData} />

                    ) : chartType === "3DScatter" ? (
                        <div id="plotly-chart" style={{ width: '100%', height: '400px' }}></div>
                    ) : null}

                    {chartType !== "3DScatter" && (
                        <button className="download-btn" onClick={downloadChart}>
                            ⬇️ Download Chart
                        </button>
                    )}
                </div>

                <div className="ai-box">
                    <h3>🤖 AI-Powered Insights</h3>
                    <p id="ai-analysis" className="ai-trigger" onClick={getai}>
                        Click to generate insights with OpenAI
                    </p>
                </div>
            </div>
        </>
    );
}
