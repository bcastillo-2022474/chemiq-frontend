
  
  export function RecentProjects({ projects }) {
    return (
      <div className="rounded-2xl bg-gray-50 p-5 shadow-lg">
        <h2 className="text-base font-semibold mb-4">Recent Projects</h2>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-xl bg-white px-5 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 text-xs font-semibold flex items-center justify-center">
                  {project.code}
                </div>
                <div>
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="text-xs text-gray-500">${project.budget.toLocaleString()}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600">{project.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  