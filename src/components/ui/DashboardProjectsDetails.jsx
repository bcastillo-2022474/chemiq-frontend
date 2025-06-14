import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { getColors } from "@/actions/personalization";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

export function ProjectDetails({ project, members, onAddMember, onDeleteProject, onEditProject, projectOwner }) {
  console.log("Project Details", projectOwner);
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
  });

  const fetchColors = async () => {
    const [error, colors] = await getColors();
    if (error) {
      console.error("Error fetching colors:", error);
      return;
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    );
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }));
    console.log("Fetched colors:", formattedColors);
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const ownerDetails = projectOwner || null;
  const integrantes = Array.isArray(members) ? members : [];
  const youtubeVideoId = project.youtube
    ? project.youtube.split("youtu.be/")[1]?.split("?")[0] ||
    project.youtube.split("v=")[1]?.split("&")[0]
    : null;

  return (
    <div className="w-full lg:w-2/3 rounded-xl shadow-lg overflow-hidden"
         style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
      <div className="relative h-64">
        <img
          src={project.img || "/placeholder.svg"}
          alt={project.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center"
             style={{ backgroundColor: 'rgba(95, 95, 95, 0.5)' }}>
          <h2 className="text-3xl font-bold" style={{ color: theme.colors.Secondary || '#e4e4e4' }}>
            {project.nombre}
          </h2>
          {ownerDetails && (
            <div className="mt-2 px-3 py-1 rounded-full text-sm font-medium flex items-center" style={{
              backgroundColor: theme.colors.Primary || '#fc5000',
              color: theme.colors.Secondary || '#e4e4e4'
            }}>
              {ownerDetails.img && (
                <img
                  src={ownerDetails.img || "/placeholder.svg"}
                  alt={ownerDetails.nombre}
                  className="w-5 h-5 rounded-full mr-2 object-cover"
                />
              )}
              Owner: {ownerDetails.name}
            </div>
          )}
        </div>
        <Link
          to={"../"}
          style={{
            backgroundColor: theme.colors.Primary || '#fc5000',
          }}
          className="absolute size-10 rounded-full right-2 top-2 flex items-center justify-center cursor-pointer">
          <X/>
        </Link>
      </div>
      <div className="p-6">
        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={() => onEditProject(project)}
            className="px-3 py-2 rounded-md transition duration-150 ease-in-out flex items-center"
            style={{
              backgroundColor: theme.colors.Primary || '#fc5000',
              color: theme.colors.Secondary || '#e4e4e4'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = theme.colors.Accent || '#505050';
              e.target.style.color = theme.colors.Secondary || '#e4e4e4';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = theme.colors.Primary || '#fc5000';
              e.target.style.color = theme.colors.Secondary || '#e4e4e4';
            }}
          >
            <Edit className="w-4 h-4 mr-1"/>
            Edit
          </button>
          <button
            onClick={() => onDeleteProject(project.id)}
            className="px-3 py-2 rounded-md transition duration-150 ease-in-out flex items-center"
            style={{
              backgroundColor: theme.colors.Primary || '#fc5000',
              color: theme.colors.Secondary || '#e4e4e4'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = theme.colors.Accent || '#505050';
              e.target.style.color = theme.colors.Secondary || '#e4e4e4';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = theme.colors.Primary || '#fc5000';
              e.target.style.color = theme.colors.Secondary || '#e4e4e4';
            }}
          >
            <Trash2 className="w-4 h-4 mr-1"/>
            Delete
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.Accent || '#505050' }}>
            Information
          </h3>
          {ownerDetails && (
            <div className="mb-2 flex items-center">
              <span className="font-semibold mr-2" style={{ color: theme.colors.Primary || '#fc5000' }}>
                Project Owner:
              </span>
              <div className="flex items-center px-2 py-1 rounded-md"
                   style={{ backgroundColor: '#fffaf5', color: theme.colors.Tertiary || '#5f5f5f' }}>
                {ownerDetails.img && (
                  <img
                    src={ownerDetails.img || "/placeholder.svg"}
                    alt={ownerDetails.nombre}
                    className="w-5 h-5 rounded-full mr-2 object-cover"
                  />
                )}
                <span>{ownerDetails.name}</span>
                <span className="text-xs ml-1" style={{ color: theme.colors.Primary || '#fc5000' }}>
                  ({ownerDetails.carne})
                </span>
              </div>
            </div>
          )}
          <p style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>{project.informacion}</p>
        </div>
        {youtubeVideoId && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.Accent || '#505050' }}>
              YouTube Video
            </h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="YouTube video player"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.Accent || '#505050' }}>
            Team Members
          </h3>
          {integrantes.length > 0 ? (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {integrantes.map((integrante) => (
                <li key={integrante.id} className="flex items-center space-x-2">
                  <img
                    src={integrante.user?.img || "/placeholder.svg"}
                    alt={integrante.user?.name || `Team member ${integrante.user?.carne}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                    {integrante.user?.name || "Unknown"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
              No team members added yet.
            </p>
          )}
          <button
            onClick={onAddMember}
            className="mt-4 px-4 py-2 rounded-md transition duration-150 ease-in-out"
            style={{
              backgroundColor: theme.colors.Primary || '#fc5000',
              color: theme.colors.Secondary || '#e4e4e4'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = theme.colors.Accent || '#505050';
              e.target.style.color = theme.colors.Secondary || '#e4e4e4';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = theme.colors.Primary || '#fc5000';
              e.target.style.color = theme.colors.Secondary || '#e4e4e4';
            }}
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
}