import { useContext } from 'react';
import { ContentContext, ContentProvider } from './ContentContext';

function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

export { ContentProvider, useContent };
