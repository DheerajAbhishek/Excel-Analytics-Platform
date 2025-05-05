import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './Upload.css';
import Sidebar from './Sidebar';
import PieChart from './Piechart'; // Import the PieChart component

export default function Upload() {
    const [fileName, setFileName] = useState('');
    const [excelData, setExcelData] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            setFileName(file.name);

            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet);
                setExcelData(data);
                console.log('Parsed Excel Data:', data);
            };
            reader.readAsArrayBuffer(file); // Updated method
        } else {
            alert('Please upload a valid Excel file (.xlsx or .xls)');
        }
    };


    return (
        <><Sidebar />

            <div className="upload-container">
                <h2>Upload Excel File</h2>
                <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
                {fileName && <p>Uploaded: <strong>{fileName}</strong></p>}
                {excelData && <pre>{JSON.stringify(excelData, null, 2)}</pre>}
            </div>
            <PieChart /> {/* Pass the excelData to the PieChart component */}
        </>
    );
}
