import Paper from "@mui/material/Paper";
import UserForm from "../../components/UserForm";
import Typography from "@mui/material/Typography";

function CreateStudentPage() {
  return (
    <>
      <Paper elevation={3} sx={{ p: 1 }} >
        <Typography variant="h5" sx={{ m: 3 }} >Create Student</Typography>
        <Paper elevation={1} sx={{ m: 3 }}>
          <UserForm></UserForm>
        </Paper>
      </Paper>
    </>
  );
}

export default CreateStudentPage;
