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

export default function Charts() {
    const { excelData } = useContext(UserContext);
    const [chartType, setChartType] = useState("Bar");
    const [xAxisKey, setXAxisKey] = useState("");
    const [yAxisKey, setYAxisKey] = useState("");
    const [scriptLoaded, setScriptLoaded] = useState(false);

    const chartRef = useRef(null);  // Reference for the chart to access its methods
    const chartInstanceRef = useRef(null);  // Reference to store chart instance

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

    // Load AI script when data is available
    useEffect(() => {
        if (excelData?.length && !window.puter) {
            const script = document.createElement("script");
            script.src = "https://js.puter.com/v2/";
            script.async = true;

            script.onload = () => setScriptLoaded(true);
            script.onerror = () => console.error("Failed to load AI script");

            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [excelData]);

    // AI Insight handler
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

    // Function to download chart as image
    const downloadChart = () => {
        if (chartRef.current) {
            // Access chart instance through the ref
            const chart = chartRef.current;

            // Destroy any previous chart instance if it exists
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
            // Store the chart instance for later destruction
            chartInstanceRef.current = chartRef.current.chartInstance;
        }
    }, [chartRef]);

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
                        <Bar ref={chartRef} data={chartData} />
                    </div>
                )}
                {chartType === "Pie" && xLabels && yValues && (
                    <div className="pi">
                        <Pie ref={chartRef} data={chartData} />
                    </div>
                )}

                {/* Download Button */}
                <button onClick={downloadChart} style={{ marginTop: '20px', color: '#fff', backgroundColor: '#007bff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                    Download Chart
                </button>

                {/* AI Analysis Section */}
                <div style={{
                    background: "#f9f9f9",
                    marginTop: "2rem",
                    padding: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    width: "100%",
                }}>
                    <h3>📊 AI-Powered Insights with Open AI</h3>
                    <p
                        id="ai-analysis"
                        style={{ color: "#444", fontStyle: "italic", cursor: "pointer" }}
                        onClick={getai}
                    >
                        Click to get AI analysis
                    </p>
                </div>
            </div>
        </>
    );
}
