function FileExplorer({ files, selectedFile, onSelectFile }) {
  return (
    <div className="file-explorer">
      <h3>EXPLORER</h3>

      {Object.keys(files).map((fileName) => (
        <div
          key={fileName}
          className={`file-item ${
            selectedFile === fileName ? "active-file" : ""
          }`}
          onClick={() => onSelectFile(fileName)}
        >
          📄 {fileName}
        </div>
      ))}
    </div>
  );
}

export default FileExplorer;