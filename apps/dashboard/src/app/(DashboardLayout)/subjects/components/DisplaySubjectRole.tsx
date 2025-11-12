"use client";

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Chip,
  TableContainer,
  Paper,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useGetSubjectRolesQuery } from "@/store/services/subject_roleApi";

export default function DisplaySubjectRoles() {
  const params = useParams();
  const subjectId = params.id as string;

  const {
    data: roles = [],
    isLoading,
    isError,
  } = useGetSubjectRolesQuery(subjectId);

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        Failed to load subject roles.
      </Typography>
    );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={3} mt={3}>
        Subject Rules
      </Typography>

      {roles.length === 0 ? (
        <Typography
          variant="body1"
          align="center"
          color="red"
          sx={{ fontSize: "16px" }}
        >
          No rules found for this subject.
        </Typography>
      ) : (
        
          <Table
            sx={{
              border: "2px solid black",
              borderCollapse: "collapse",
              "& td, & th": { border: "1px solid black", padding: "8px" },
            }}
          >
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Symbol
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Min %
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Max %
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {r.symbol}
                  </TableCell>
                  <TableCell align="center">{r.minPercentage}</TableCell>
                  <TableCell align="center">{r.maxPercentage}</TableCell>
                  <TableCell align="center">
                    {r.minPercentage >= 50 ? (
                      <Chip label="Pass" color="success" size="small" />
                    ) : (
                      <Chip label="Low" color="warning" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

      )}
    </Box>
  );
}
