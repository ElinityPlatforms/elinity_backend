import apiClient from './client';

export const blogsApi = {
    getBlogs: async (): Promise<any[]> => {
        const response = await apiClient.get('/blogs/');
        return response.data;
    },

    getBlog: async (blogId: string): Promise<any> => {
        const response = await apiClient.get(`/blogs/${blogId}`);
        return response.data;
    },

    // Admin endpoints
    createBlog: async (data: any): Promise<any> => {
        const response = await apiClient.post('/admin/blogs/', data);
        return response.data;
    },

    updateBlog: async (blogId: string, data: any): Promise<any> => {
        const response = await apiClient.put(`/admin/blogs/${blogId}`, data);
        return response.data;
    },

    deleteBlog: async (blogId: string): Promise<void> => {
        await apiClient.delete(`/admin/blogs/${blogId}`);
    },
};

export default blogsApi;
