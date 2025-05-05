import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Sample data (you can fetch this from Excel or API later)
const data = [
    { name: "Food", value: 40 },
    { name: "Rent", value: 30 },
    { name: "Transport", value: 15 },
    { name: "Utilities", value: 10 },
    { name: "Other", value: 5 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export default function PieChartComponent() {
    return (
        <div style={{ margin: "240px" }}>
            <PieChart width={400} m height={300}>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}

