import { FileUpload } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import * as React from 'react';
import FileUploader from "react-mui-fileuploader"
import { ExtendedFileProps } from 'react-mui-fileuploader/dist/types/index.types';
import { read, writeFileXLSX } from "xlsx";
import { useSpreadsheetContext } from './Context/SpreadsheetContext';

export default function FileUploadButton() {
  const { parse } = useSpreadsheetContext();

  const handleFilesChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Update chosen files
    if (e.target.files?.[0]) {
      parse(e.target.files?.[0]);
    }
  }, []);

  return (
    <IconButton color="primary" aria-label="upload picture" component="label">
      <input hidden accept="application/xlsx" type="file" onChange={handleFilesChange} />
      <FileUpload />
    </IconButton>
  )
}
