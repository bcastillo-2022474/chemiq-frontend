import { useEffect, useState } from "react";
import { getMyProjects } from "@/actions/getMyProjects";

export const useMyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const [error, data] = await getMyProjects();

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data);
      }

      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  return { projects, isLoading };
};
