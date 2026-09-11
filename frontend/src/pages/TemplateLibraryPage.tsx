import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setTemplates, setLoading } from '../slices/templateSlice';
import apiClient from '../api/client';
import { DocumentIcon } from '@heroicons/react/24/outline';

const TemplateLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { templates, loading } = useAppSelector((state) => state.templates);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      dispatch(setLoading(true));
      try {
        const response = await apiClient.get('/templates');
        dispatch(setTemplates(response.data.data));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch templates');
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTemplates();
  }, [dispatch]);

  const handleCreateDocument = async (templateId: string) => {
    try {
      const response = await apiClient.post('/documents', {
        title: `New Document from Template`,
        templateId,
      });
      navigate(`/documents/${response.data.data.id}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create document');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Template Library</h1>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12">
          <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No templates available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <span className="badge badge-primary mb-4 inline-block">{template.category}</span>
              <button
                onClick={() => handleCreateDocument(template.id)}
                className="btn btn-primary w-full"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateLibraryPage;
