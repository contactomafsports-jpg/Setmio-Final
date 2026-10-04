import React from 'react';
import { BlogView } from './BlogView';

export const BlogPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return <BlogView onBack={onBack} />;
};

export default BlogPage;
