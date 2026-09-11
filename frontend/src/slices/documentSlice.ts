import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Document {
  id: string;
  title: string;
  content: Record<string, any>;
  status: 'DRAFT' | 'COMPLETED' | 'SIGNED';
  templateId: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  loading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  selectedDocument: null,
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDocuments: (state, action: PayloadAction<Document[]>) => {
      state.documents = action.payload;
    },
    setSelectedDocument: (state, action: PayloadAction<Document | null>) => {
      state.selectedDocument = action.payload;
    },
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.push(action.payload);
    },
    updateDocument: (state, action: PayloadAction<Document>) => {
      const index = state.documents.findIndex((doc) => doc.id === action.payload.id);
      if (index !== -1) {
        state.documents[index] = action.payload;
      }
      if (state.selectedDocument?.id === action.payload.id) {
        state.selectedDocument = action.payload;
      }
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter((doc) => doc.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setDocuments,
  setSelectedDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  setError,
} = documentSlice.actions;
export default documentSlice.reducer;
