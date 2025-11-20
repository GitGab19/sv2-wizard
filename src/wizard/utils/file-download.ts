// Helper function to download a file

export const downloadFile = (content: string, filename: string) => {
  // Browsers strip leading dots from filenames for security reasons
  // For .env files, we need to use a workaround: download as "env" and let user rename,
  // or try to force it with a different approach
  let downloadFilename = filename;
  
  // Workaround for .env files: some browsers strip the leading dot
  // Try to preserve it by using a workaround with the download attribute
  if (filename === '.env') {
    // Try using the full filename - some browsers may preserve it
    downloadFilename = '.env';
  }
  
  // For .env files, use application/octet-stream to prevent browsers from adding .txt extension
  const mimeType = filename.endsWith('.env') 
    ? 'application/octet-stream' 
    : 'text/plain';
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // Set the download attribute - browsers may still strip leading dots
  link.setAttribute('download', downloadFilename);
  
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

