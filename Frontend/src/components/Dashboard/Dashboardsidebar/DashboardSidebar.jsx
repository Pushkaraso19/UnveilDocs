// import React, { useState } from 'react';

// const DashboardSidebar = ({ activeDocument, setActiveDocument, onDocumentUpload }) => {
//   const [documents, setDocuments] = useState([
//     { id: 1, name: "Comprehensive Auto Policy", active: true, type: "pdf", uploadDate: "2023-10-15" },
//     { id: 2, name: "Homeowners Insurance Policy", active: false, type: "pdf", uploadDate: "2023-09-22" },
//     { id: 3, name: "Life Insurance Plan Details", active: false, type: "docx", uploadDate: "2023-11-05" },
//     { id: 4, name: "Umbrella Policy Addendum", active: false, type: "pdf", uploadDate: "2023-08-17" }
//   ]);
//   const [isUploading, setIsUploading] = useState(false);

//   const handleDocumentClick = (id) => {
//     const updatedDocs = documents.map(doc => ({
//       ...doc,
//       active: doc.id === id
//     }));
//     setDocuments(updatedDocs);
//     const selectedDoc = updatedDocs.find(doc => doc.id === id);
//     setActiveDocument(selectedDoc);
//   };

//   const addNewDocument = () => {
//     // Create a hidden file input element
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file';
//     fileInput.accept = '.pdf,.docx';
//     fileInput.multiple = true;
    
//     fileInput.onchange = (e) => {
//       const files = e.target.files;
//       if (files.length > 0) {
//         setIsUploading(true);
        
//         // Simulate file upload
//         setTimeout(() => {
//           const newFiles = Array.from(files).map((file, index) => ({
//             id: documents.length + index + 1,
//             name: file.name,
//             active: false,
//             type: file.name.split('.').pop(),
//             uploadDate: new Date().toISOString().split('T')[0]
//           }));
          
//           setDocuments([...documents, ...newFiles]);
//           setIsUploading(false);
          
//           if (onDocumentUpload) {
//             onDocumentUpload(newFiles);
//           }
//         }, 1500);
//       }
//     };
    
//     fileInput.click();
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <aside className="sticky top-[65px] z-20 hidden h-[calc(100vh-65px)] w-64 flex-col border-r border-white/10 bg-black/30 p-4 backdrop-blur-xl lg:flex">
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg font-semibold text-white">Documents</h2>
//         <button 
//           className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white relative"
//           onClick={addNewDocument}
//           disabled={isUploading}
//         >
//           {isUploading ? (
//             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--primary-500)]"></div>
//           ) : (
//             <span className="material-symbols-outlined">add</span>
//           )}
//         </button>
//       </div>
      
//       <nav className="mt-4 flex-1 space-y-2 overflow-y-auto">
//         {documents.map((doc) => (
//           <div 
//             key={doc.id}
//             className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 cursor-pointer group ${
//               doc.active 
//                 ? 'bg-white/10 text-white shadow-lg' 
//                 : 'text-white/60 hover:bg-white/10 hover:text-white'
//             }`}
//             onClick={() => handleDocumentClick(doc.id)}
//           >
//             <span className="material-symbols-outlined text-[var(--primary-500)]">description</span>
//             <div className="flex-1 min-w-0">
//               <p className="truncate">{doc.name}</p>
//               <p className="text-xs opacity-60 mt-1">{formatDate(doc.uploadDate)} · {doc.type.toUpperCase()}</p>
//             </div>
//             <span className={`material-symbols-outlined text-xs transition-opacity duration-300 ${doc.active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}>
//               {doc.active ? 'radio_button_checked' : 'radio_button_unchecked'}
//             </span>
//           </div>
//         ))}
//       </nav>
      
//       <div className="mt-auto pt-4 border-t border-white/10">
//         <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white" href="#">
//           <span className="material-symbols-outlined">dashboard</span>
//           <span>Dashboard</span>
//         </a>
//         <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white" href="#">
//           <span className="material-symbols-outlined">history</span>
//           <span>Recent Questions</span>
//         </a>
//         <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white" href="#">
//           <span className="material-symbols-outlined">settings</span>
//           <span>Settings</span>
//         </a>
//       </div>
//     </aside>
//   );
// };

// export default DashboardSidebar;




import React, { useState } from 'react';

const DashboardSidebar = ({ activeDocument, setActiveDocument, onDocumentUpload }) => {
  const [documents, setDocuments] = useState([
    { id: 1, name: "Comprehensive Auto Policy", active: true, type: "pdf", uploadDate: "2023-10-15" },
    { id: 2, name: "Homeowners Insurance Policy", active: false, type: "pdf", uploadDate: "2023-09-22" },
    { id: 3, name: "Life Insurance Plan Details", active: false, type: "docx", uploadDate: "2023-11-05" },
    { id: 4, name: "Umbrella Policy Addendum", active: false, type: "pdf", uploadDate: "2023-08-17" }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDocumentClick = (id) => {
    const updatedDocs = documents.map(doc => ({
      ...doc,
      active: doc.id === id
    }));
    setDocuments(updatedDocs);
    const selectedDoc = updatedDocs.find(doc => doc.id === id);
    setActiveDocument(selectedDoc);
  };

  const addNewDocument = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.docx';
    fileInput.multiple = true;
    
    fileInput.onchange = (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        setIsUploading(true);
        
        setTimeout(() => {
          const newFiles = Array.from(files).map((file, index) => ({
            id: documents.length + index + 1,
            name: file.name,
            active: false,
            type: file.name.split('.').pop(),
            uploadDate: new Date().toISOString().split('T')[0]
          }));
          
          setDocuments([...documents, ...newFiles]);
          setIsUploading(false);
          
          if (onDocumentUpload) {
            onDocumentUpload(newFiles);
          }
        }, 1500);
      }
    };
    
    fileInput.click();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <aside className="fixed top-[65px] left-0 z-20 h-[calc(100vh-65px)] w-64 flex-col border-r border-white/10 bg-black/30 p-4 backdrop-blur-xl lg:flex">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Documents</h2>
        <button 
          className="rounded-md p-1 text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-110 relative"
          onClick={addNewDocument}
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--primary-500)]"></div>
          ) : (
            <span className="material-symbols-outlined">add</span>
          )}
        </button>
      </div>
      
      <nav className="mt-4 flex-1 space-y-2 overflow-y-auto">
        {documents.map((doc) => (
          <div 
            key={doc.id}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 cursor-pointer group ${
              doc.active 
                ? 'bg-gradient-to-r from-[var(--primary-500)]/20 to-[var(--primary-400)]/10 text-white shadow-lg' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
            onClick={() => handleDocumentClick(doc.id)}
          >
            <span className={`material-symbols-outlined ${doc.active ? 'text-[var(--primary-500)]' : 'text-white/40 group-hover:text-[var(--primary-400)]'}`}>
              description
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate">{doc.name}</p>
              <p className="text-xs opacity-60 mt-1">{formatDate(doc.uploadDate)} · {doc.type.toUpperCase()}</p>
            </div>
            <span className={`material-symbols-outlined text-xs transition-all duration-300 ${doc.active ? 'opacity-100 text-[var(--primary-500)]' : 'opacity-0 group-hover:opacity-60'}`}>
              {doc.active ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
          </div>
        ))}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-white/10">
        <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-all duration-300 hover:bg-white/5 hover:text-white hover:translate-x-1" href="#">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </a>
        <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-all duration-300 hover:bg-white/5 hover:text-white hover:translate-x-1" href="#">
          <span className="material-symbols-outlined">history</span>
          <span>Recent Questions</span>
        </a>
        <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-all duration-300 hover:bg-white/5 hover:text-white hover:translate-x-1" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
};

export default DashboardSidebar;