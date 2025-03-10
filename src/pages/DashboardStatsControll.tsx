import { Users, Activity, CheckSquare, DollarSign } from 'lucide-react';
import { Sidebar } from '../components/ui/SideBarDashboard.js';
import { MetricCard } from '../components/ui/DashboardCardsSstats.js';
import { OverviewChart } from '../components/ui/DashboardChardStats.js';
import { RecentProjects } from '../components/ui/DashboardProjectsStats.js';


const metrics = [
  { title: 'Total Users', value: '24', change: '+10% from last month', icon: <Users className="h-5 w-5 text-gray-400" /> },
  { title: 'Active Projects', value: '7', change: '+2 since last week', icon: <Activity className="h-5 w-5 text-gray-400" /> },
  { title: 'Completed Projects', value: '12', change: '+3 since last month', icon: <CheckSquare className="h-5 w-5 text-gray-400" /> },
  { title: 'Budget Spent', value: '$48,500', change: '+15% from last quarter', icon: <DollarSign className="h-5 w-5 text-gray-400" /> }
];

const recentProjects = [
  { id: '1', code: 'OS', name: 'Organic Synthesis', budget: 12000, status: 'In Progress' },
  { id: '2', code: 'PR', name: 'Polymer Research', budget: 20000, status: 'In Progress' },
  { id: '3', code: 'CS', name: 'Catalysis Study', budget: 15000, status: 'In Progress' },
  { id: '4', code: 'NA', name: 'Nanoparticle Analysis', budget: 18000, status: 'In Progress' }
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-64 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        {/* Charts and recent projects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OverviewChart />
          </div>
          <div>
            <RecentProjects projects={recentProjects} />
          </div>
        </div>
      </div>
    </div>
  );
}
