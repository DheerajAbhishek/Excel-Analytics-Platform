import './Dashboard.css';
import Sidebar from './Sidebar';

export default function Dashboard() {
    return (
        <><Sidebar />

            <div className="dashboard-container">
                <h1 className='dash-heading' >Dashboard</h1>
                <p>Welcome to your dashboard! Here you can manage your files, view analytics, and more.</p>
            </div>

        </>
    );
}