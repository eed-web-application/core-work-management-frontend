import React, { useCallback, useRef } from 'react';
import './SideSheet.css'; // Ensure you have this CSS file

const SideSheet = ({ sheetBody, isOpen, onClose }) => {
  const sheetRef = useRef(null);

  const mouseMoveHandler = useCallback((e) => {
    if (sheetRef.current) {
      const sheetRect = sheetRef.current.getBoundingClientRect();
      sheetRef.current.style.width = `${e.clientX - sheetRect.left}px`;
    }
  }, []);

  const endDrag = useCallback(() => {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', endDrag);
  }, [mouseMoveHandler]);

  const startDrag = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', endDrag);
    },
    [mouseMoveHandler, endDrag]
  );

  return (
    <div className={`side-sheet-container ${isOpen ? 'open' : ''}`}>
      <div className="side-sheet" ref={sheetRef}>
        <div className="sheet-header">
          <button className="close-btn" onClick={onClose}>
            &times; {/* HTML entity for "×" */}
          </button>
        </div>
        <div className="side-sheet-content">{sheetBody}</div>
        <div className="resize-handle" onMouseDown={startDrag}></div>
      </div>
    </div>
  );
};

export default SideSheet;
