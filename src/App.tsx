import { AppBar, Container, Grid, IconButton, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import { Menu as MenuIcon } from '@mui/icons-material';
import FileUpload from './Upload';
import { SpreadsheetProvider, useSpreadsheetContext } from "./Context/SpreadsheetContext";
import Table from './Table';

export default function App() {
  const { columns, rows } = useSpreadsheetContext();
  return (
      <Container maxWidth="md">
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
              TWatt Spreader
            </Typography>
            <FileUpload />
          </Toolbar>
        </AppBar>
        <TableContainer component={Paper} style={{ height: 'calc(100vh - 56px)' }}>
          <Table />
        </TableContainer>
      </Container>
  );
}