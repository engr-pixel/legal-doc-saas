import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Template {
  id: string;
  name: string;
  description: string;
  content: Record<string, any>;
  category: string;
  isPublic: boolean;
  createdAt: string;
}

interface TemplateState {
  templates: Template[];
  selectedTemplate: Template | null;
  loading: boolean;
  error: string | null;
}

const initialState: TemplateState = {
  templates: [],
  selectedTemplate: null,
  loading: false,
  error: null,
};

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTemplates: (state, action: PayloadAction<Template[]>) => {
      state.templates = action.payload;
    },
    setSelectedTemplate: (state, action: PayloadAction<Template | null>) => {
      state.selectedTemplate = action.payload;
    },
    addTemplate: (state, action: PayloadAction<Template>) => {
      state.templates.push(action.payload);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setTemplates, setSelectedTemplate, addTemplate, setError } = templateSlice.actions;
export default templateSlice.reducer;
