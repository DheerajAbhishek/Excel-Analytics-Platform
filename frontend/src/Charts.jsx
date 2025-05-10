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

import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { Pie, Bar } from 'react-chartjs-2';
import './Charts.css';
import './head.css';
import Sidebar from './Sidebar';

export default function Charts() {
    const { excelData } = useContext(UserContext);
    const [chartType, setChartType] = useState("Bar");
    const [xAxisKey, setXAxisKey] = useState("");
    const [yAxisKey, setYAxisKey] = useState("");

    const labels = excelData ? Object.keys(excelData[0]) : [];
    const xLabels = excelData?.map(item => item[xAxisKey]);
    const yValues = excelData?.map(item => Number(item[yAxisKey]));

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
        if (excelData?.length) {
            const script = document.createElement("script");
            script.src = "https://js.puter.com/v2/";
            script.async = true;
            script.onload = () => {
                const summaryBox = document.getElementById("ai-analysis");
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
            document.body.appendChild(script);
        }
    }, [excelData]);

    return (
        <>
            <div className='head'>
                <h1 className='heading'>Analysis</h1>
            </div>
            <Sidebar />
            <div className="charts">
                <h4>Select the type of graph</h4>
                <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                    <option value="Bar">Bar Chart</option>
                    <option value="Pie">Pie Chart</option>
                </select><br />

                <h4>Specify x-axis</h4>
                <select value={xAxisKey} onChange={(e) => setXAxisKey(e.target.value)}>
                    <option value="">Select X-axis</option>
                    {labels.map((label, index) => (
                        <option key={index} value={label}>{label}</option>
                    ))}
                </select>

                <h4>Select Y-axis</h4>
                <select value={yAxisKey} onChange={(e) => setYAxisKey(e.target.value)}>
                    <option value="">Select Y-axis</option>
                    {labels.map((label, index) => (
                        <option key={index} value={label}>{label}</option>
                    ))}
                </select>

                {chartType === "Bar" && xLabels && yValues && (
                    <div className="pi">
                        <Bar data={chartData} />
                    </div>
                )}
                {chartType === "Pie" && xLabels && yValues && (
                    <div className="pi">
                        <Pie data={chartData} />
                    </div>
                )}

                {/* AI Analysis Section */}
                <div style={{
                    background: "#f9f9f9",
                    marginTop: "2rem",
                    padding: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    width: "100%",
                }}>
                    <h3>📊 AI-Powered Insights</h3>
                    <p id="ai-analysis" style={{ color: "#444", fontStyle: "italic" }}>Loading insight...</p>
                </div>
            </div>
        </>
    );
}
