import React, { useCallback, useRef } from 'react';

const SideSheet = ({ sheetBody, isOpen, onClose, styles }) => {
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
    <div className={`${styles.sideSheetContainer} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sideSheet} ref={sheetRef}>
        <div className={styles.sheetHeader}>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.sideSheetContent}>{sheetBody}</div>
        <div className={styles.resizeHandle} onMouseDown={startDrag}></div>
      </div>
    </div>
  );
};

export default SideSheet;
