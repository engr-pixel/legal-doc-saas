import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setDocuments, setLoading } from '../slices/documentSlice';
import apiClient from '../api/client';
import { PlusIcon, DocumentIcon } from '@heroicons/react/24/outline';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { documents, loading } = useAppSelector((state) => state.documents);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      dispatch(setLoading(true));
      try {
        const response = await apiClient.get('/documents');
        dispatch(setDocuments(response.data.data));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch documents');
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchDocuments();
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
        <Link
          to="/templates"
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          New Document
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12">
          <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No documents yet</p>
          <Link to="/templates" className="btn btn-primary">
            Create your first document
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              to={`/documents/${doc.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(doc.updatedAt).toLocaleDateString()}
              </p>
              <span className="badge badge-primary">{doc.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
