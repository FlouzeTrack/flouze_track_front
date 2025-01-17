import API from "./api";

interface CreateFavoriteRequest {
  address: string;
  label: string;
}

interface UpdateFavoriteRequest {
  address: string; // Changed from walletAddress to address
  label: string;
}

export const FavoritesService = {
  createFavorite: async (address: string, label: string) => {
    const response = await API.post<void>("/favorites/create", {
      address,
      label,
    });
    return response.data;
  },

  updateFavorite: async (id: string, data: UpdateFavoriteRequest) => {
    const payload = {
      address: data.walletAddress,
      label: data.label,
    };

    const response = await API.put<void>(`/favorites/${id}`, payload);
    return response.data;
  },

  deleteFavorite: async (id: string) => {
    return API.delete(`/favorites/${id}`);
  },
};
