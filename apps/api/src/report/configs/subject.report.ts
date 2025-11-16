

import { Grade } from "src/grade/entities/grade.entity";
import { ReportConfig } from "../interfaces/report-config.interface";
import { Subject } from "src/subject/entities/subject.entity";
import { User } from "src/users/entities/user.entity";


export const StudentGradesReportConfig: ReportConfig = {
  name: "student-grades",
  model: Grade, // primary model
  columns: ["id", "score", "createdAt"],
  relations: [
    {
      model: User,
      attributes: ["id", "name", "email"],
    },
    {
      model: Subject,
      attributes: ["id", "name", "code"],
    },
  ],
  allowedFilters: ["studentId", "subjectId", "minScore", "maxScore"],
  defaultOrder: ["createdAt", "DESC"],
};
