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
import { UserContext } from "./UserContext";
import { useContext, useState } from "react";
import { Pie, Bar } from 'react-chartjs-2';
import './Charts.css';
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

    return (
        <>
            <Sidebar />
            <div className="charts">
                {/* Chart Type Selector */}
                <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                    <option value="Bar">Bar Chart</option>
                    <option value="Pie">Pie Chart</option>
                </select>

                {/* X-axis Selector */}
                <select value={xAxisKey} onChange={(e) => setXAxisKey(e.target.value)}>
                    <option value="">Select X-axis</option>
                    {labels.map((label, index) => (
                        <option key={index} value={label}>{label}</option>
                    ))}
                </select>

                {/* Y-axis Selector */}
                <select value={yAxisKey} onChange={(e) => setYAxisKey(e.target.value)}>
                    <option value="">Select Y-axis</option>
                    {labels.map((label, index) => (
                        <option key={index} value={label}>{label}</option>
                    ))}
                </select>

                {/* Chart Display */}
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
            </div>
        </>
    );
}
