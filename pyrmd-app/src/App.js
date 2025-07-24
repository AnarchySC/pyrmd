import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Zap, RotateCcw, Check } from 'lucide-react';

const FileExtensionChanger = () => {
  const [files, setFiles] = useState([]);
  const [newExtension, setNewExtension] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const fileData = selectedFiles.map((file, index) => ({
      id: index,
      originalFile: file,
      originalName: file.name,
      originalExtension: file.name.split('.').pop(),
      baseName: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
      newName: '',
      processed: false
    }));
    setFiles(fileData);
  };

  const updateNewExtension = (ext) => {
    // Remove leading dot if user enters it
    const cleanExt = ext.replace(/^\./, '');
    setNewExtension(cleanExt);
    
    // Update all file new names
    setFiles(prevFiles => 
      prevFiles.map(file => ({
        ...file,
        newName: cleanExt ? `${file.baseName}.${cleanExt}` : file.baseName,
        processed: false
      }))
    );
  };

  const processFiles = async () => {
    if (!newExtension) return;
    
    setIsProcessing(true);
    
    // Simulate processing with a delay for visual effect
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setFiles(prevFiles => 
      prevFiles.map(file => ({
        ...file,
        processed: true
      }))
    );
    
    setIsProcessing(false);
  };

  const downloadFile = (file) => {
    const url = URL.createObjectURL(file.originalFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = async () => {
    const zip = new window.JSZip();
    
    // Add each processed file to the zip
    files.forEach(file => {
      if (file.processed) {
        zip.file(file.newName, file.originalFile);
      }
    });
    
    // Generate the zip file
    const zipBlob = await zip.generateAsync({type: "blob"});
    
    // Download the zip
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pyrmd-transformed-files.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetApp = () => {
    setFiles([]);
    setNewExtension('');
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-2 flex items-center justify-center gap-3 tracking-wide" style={{fontFamily: '"Exo 2", "Exo", "Orbitron", monospace', textTransform: 'lowercase', letterSpacing: '0.15em', fontWeight: '900'}}>
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 48 48" 
              className="text-purple-300"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="18" y="6" width="12" height="12" rx="2" fill="black"/>
              <rect x="6" y="30" width="12" height="12" rx="2" fill="black"/>
              <rect x="30" y="30" width="12" height="12" rx="2" fill="black"/>
              <line x1="24" y1="18" x2="12" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <line x1="24" y1="18" x2="36" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <line x1="18" y1="36" x2="30" y2="36" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            pyrmd
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 48 48" 
              className="text-purple-300"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="18" y="6" width="12" height="12" rx="2" fill="black"/>
              <rect x="6" y="30" width="12" height="12" rx="2" fill="black"/>
              <rect x="30" y="30" width="12" height="12" rx="2" fill="black"/>
              <line x1="24" y1="18" x2="12" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <line x1="24" y1="18" x2="36" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <line x1="18" y1="36" x2="30" y2="36" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </h1>
          <p className="text-white/80 text-lg">
            Select files, choose a new extension, and transform them instantly!
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
          {files.length === 0 ? (
            <div className="text-center">
              <div className="border-4 border-dashed border-purple-400/40 rounded-xl p-12 mb-6 hover:border-purple-400/60 transition-colors">
                <Upload className="mx-auto mb-4 text-white/70" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Choose Your Files
                </h3>
                <p className="text-white/70 mb-6">
                  Select multiple files to change their extensions
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  <Upload size={20} />
                  Select Files
                </label>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-white font-semibold mb-2">
                      New Extension:
                    </label>
                    <input
                      type="text"
                      value={newExtension}
                      onChange={(e) => updateNewExtension(e.target.value)}
                      placeholder="Enter new extension (e.g., pdf, jpg, txt)"
                      className="w-full px-4 py-3 rounded-lg border-2 border-purple-500/30 bg-gray-800/50 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={resetApp}
                    className="bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 mt-8"
                  >
                    <RotateCcw size={20} />
                    Reset
                  </button>
                </div>

                {newExtension && (
                  <div className="flex gap-4">
                    <button
                      onClick={processFiles}
                      disabled={isProcessing}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap size={20} />
                          Transform Extensions
                        </>
                      )}
                    </button>

                    {files.some(f => f.processed) && (
                      <button
                        onClick={downloadAllFiles}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <Download size={20} />
                        Download ZIP
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`bg-gray-800/50 rounded-lg p-4 border border-purple-500/20 transition-all duration-300 ${
                      file.processed ? 'bg-green-900/40 border-green-400/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="text-white/70 flex-shrink-0" size={20} />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">
                            Original: {file.originalName}
                          </div>
                          {file.newName && (
                            <div className={`text-sm truncate transition-colors ${
                              file.processed ? 'text-green-300' : 'text-white/70'
                            }`}>
                              New: {file.newName}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {file.processed && (
                          <>
                            <Check className="text-green-400" size={20} />
                            <button
                              onClick={() => downloadFile(file)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
                            >
                              <Download size={16} />
                              Download
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm">
                  Selected {files.length} file{files.length !== 1 ? 's' : ''}
                  {files.some(f => f.processed) && ` • ${files.filter(f => f.processed).length} processed`}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-white font-semibold mb-2">💡 How it works:</h3>
            <p className="text-white/60 text-sm">
              1. Upload multiple files • 2. Enter your desired extension • 3. Transform & download as ZIP!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileExtensionChanger;