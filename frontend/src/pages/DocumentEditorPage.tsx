import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSelectedDocument, updateDocument } from '../slices/documentSlice';
import apiClient from '../api/client';

const DocumentEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedDocument, loading } = useAppSelector((state) => state.documents);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      try {
        const response = await apiClient.get(`/documents/${id}`);
        dispatch(setSelectedDocument(response.data.data));
        setContent(JSON.stringify(response.data.data.content, null, 2));
      } catch (err) {
        console.error('Failed to fetch document');
      }
    };

    fetchDocument();
  }, [id, dispatch]);

  const handleSave = async () => {
    if (!selectedDocument || !id) return;

    setIsSaving(true);
    try {
      const updatedDoc = {
        ...selectedDocument,
        content: JSON.parse(content),
      };
      await apiClient.put(`/documents/${id}`, updatedDoc);
      dispatch(updateDocument(updatedDoc));
      alert('Document saved successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !selectedDocument) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Loading document...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{selectedDocument.title}</h1>
        <div className="space-x-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm"
          placeholder="Edit your document content here..."
        />
      </div>
    </div>
  );
};

export default DocumentEditorPage;
