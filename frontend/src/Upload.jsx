import React, { useContext, useState } from 'react';
import * as XLSX from 'xlsx';
import './Upload.css';
import "./head.css"
import Sidebar from './Sidebar';
import { UserContext } from "./UserContext";
import { useNavigate } from 'react-router-dom';
export default function Upload() {
    const [fileName, setFileName] = useState('');
    const { setExcelData, excelData } = useContext(UserContext)
    const handleFileChange = async (e) => {
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
    const navigate = useNavigate(); // For navigation after successful login
    const analyze = () => {
        navigate('/Charts'); // Redirect to the Charts page (or wherever you want)  
    }

    return (
        <><div className='head'>
            <h1 className='heading'>Upload</h1>
        </div>
            <Sidebar />

            <div className="upload-container">
                <h2>Upload Excel File</h2>
                <div>
                    <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} /><br></br>
                    {fileName && <p>Uploaded: <strong>{fileName}</strong></p>}
                    {excelData && <pre>{JSON.stringify(excelData, null, 2)}</pre>}
                </div>
                <button className='analyse-button' onClick={analyze}>Analyze data</button>
            </div>
        </>
    );
}
