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
  CardContent,
  Card,
  Button,
  Stack,
} from "@mui/material";

import { useParams, useRouter } from "next/navigation";
import { useGetSubjectRolesQuery } from "@/store/services/subject_roleApi";

export default function DisplaySubjectRoles() {
  const params = useParams();
  const router = useRouter();
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
    <Box sx={{ p: 0 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ alignItems: 'center' }} mt={2}>
        <Typography variant="h5" fontWeight="bold" mb={3} mt={3}>
          Subject Rules
        </Typography>
        <Button
          variant="outlined"
          onClick={() =>
            router.push(`/subjects/subject/${subjectId}/subject_rules`)
          }
        >
          Manage Rules
        </Button>
      </Stack>

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
        <Card>
          <CardContent>
            <Table
              sx={{
                // border: "2px solid black",
                borderCollapse: "collapse",
                "& td, & th": { border: "1px solid black", padding: "8px" },
              }}
            >
              <TableHead >
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
                    Rule Type
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {r.symbol}
                    </TableCell>
                    <TableCell align="center">
                      {r.ruleType == "excuse" || r.ruleType == "cheat"
                        ? "-"
                        : r.minPercentage}
                    </TableCell>
                    <TableCell align="center">
                      {r.ruleType == "excuse" || r.ruleType == "cheat"
                        ? "-"
                        : r.maxPercentage}
                    </TableCell>
                    <TableCell align="center">
                      {r.ruleType === "total" && (
                        <Chip label="Total" color="primary" size="small" />
                      )}
                      {r.ruleType === "exam" && (
                        <Chip label="Exam Only" color="error" size="small" />
                      )}
                      {r.ruleType === "excuse" && (
                        <Chip label="Excuse" color="warning" size="small" />
                      )}
                      {r.ruleType === "cheat" && (
                        <Chip label="Cheat" color="default" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
