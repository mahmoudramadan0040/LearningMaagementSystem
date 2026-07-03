"use client";

import React from "react";
import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Stack,
} from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  GridColDef,
} from "@mui/x-data-grid";

interface SharedDataTableProps<T> {
  rows: T[];
  columns: GridColDef[];
  loading?: boolean;
  error?: boolean;
  getRowId: (row: T) => string | number;
  pageSizeOptions?: number[];
  dataGridProps?: Partial<DataGridProps>;
  errorMessage?: string;
}

export default function SharedDataTable<T>({
  rows,
  columns,
  loading = false,
  error = false,
  getRowId,
  pageSizeOptions = [5, 10, 25],
  dataGridProps,
  errorMessage = "Failed to load data.",
}: SharedDataTableProps<T>) {
  return (
    <Card>
      <CardContent>
        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: 300 }}
          >
            <CircularProgress />
          </Stack>
        ) : error ? (
          <Typography color="error">{errorMessage}</Typography>
        ) : (
          <DataGrid
            density="compact"
            rows={rows}
            columns={columns}
            getRowId={getRowId}
            pageSizeOptions={pageSizeOptions}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 10,
                },
              },
            }}
            disableRowSelectionOnClick
            {...dataGridProps}
          />
        )}
      </CardContent>
    </Card>
  );
}