import { ApiClient } from '@rumsan/raman/clients';
import { CreateProject, EditProject, Project } from '@rumsan/raman/types';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { useRumsan } from '@rumsan/react-query';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';

//TODO: fix any
export const useProjectSearch = (pagination: Pagination, filters: any) => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['project_list', { ...pagination, ...filters }],
      queryFn: async () => {
        const { response } = await RsClient.Project.search(pagination, filters);
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    },
    queryClient,
  );
};

export const useProjectList = (pagination: Pagination) => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['project_list', { ...pagination }],
      queryFn: async () => {
        const { response } = await RsClient.Project.list(pagination);
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    },
    queryClient,
  );
};

export const useAddProject = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: CreateProject) => {
        const { data } = await RsClient.Project.create(payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(data, 'data in query');

        return data;
      },
      onSuccess: (newProject) => {
        queryClient?.setQueryData<Project[]>(
          ['project_list'],
          (oldData = []) => {
            return [newProject, ...oldData];
          },
        );
      },
    },
    queryClient,
  );
};

export const useEditProject = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: { id: string; data: EditProject }) => {
        const { data } = await RsClient.Project.update(
          payload.id,
          payload.data,
        );

        return data;
      },
      onSuccess: (updatedProject) => {
        queryClient?.setQueryData<Project[]>(
          ['project_list'],
          (oldData = []) => {
            return oldData.map((project) =>
              project.cuid === updatedProject.cuid ? updatedProject : project,
            );
          },
        );
      },
    },
    queryClient,
  );
};

export const useProjectGet = (id: string): UseQueryResult<Project, Error> => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['project_get', id],
      queryFn: async () => {
        const { data } = await RsClient.Project.get(id);
        return data;
      },
    },
    queryClient,
  );
};
