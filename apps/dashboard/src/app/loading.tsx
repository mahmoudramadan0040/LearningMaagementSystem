import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";
import Stack from "@mui/material/Stack";
const Loading = () => {
  return (
    <Stack direction="row" alignItems="center">
      <CircularProgress size="5rem" />
    </Stack>
  );
};

export default Loading;
