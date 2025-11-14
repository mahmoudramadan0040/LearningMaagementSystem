import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Grade } from './entities/grade.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { SubjectRole } from 'src/subject_role/entities/subject_role.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { ExamSession } from 'src/exam_session/entities/exam_session.entity';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class GradeService {
  constructor(
    @InjectModel(Grade)
    private gradeModel: typeof Grade,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  private applyRules(dto: CreateGradeDto, subject: any, rules: SubjectRole[]) {
    // 🔹 Convert empty or null → 0
    dto.final_exam_score = dto.final_exam_score ? dto.final_exam_score : 0;
    dto.semester_work_score = dto.semester_work_score
      ? dto.semester_work_score
      : 0;

    // 🔹 If any score is a string → must be excuse/cheat type
    const isStringInput =
      typeof dto.final_exam_score == 'string'
      // typeof dto.semester_work_score == 'string';

    if (isStringInput) {
      // Extract only rules that are string-based: excuse / cheat
      const specialRules = rules.filter((r) =>
        ['excuse', 'cheat', 'absent'].includes(r.ruleType),
      );

      for (const rule of specialRules) {
        const symbol = rule.symbol;

        const matched =
          dto.final_exam_score == symbol || dto.semester_work_score == symbol;

        if (matched) {
          // 🔹 Set final result for special rule type
          return {
            grade: rule.symbol,
            final_exam_score:dto.final_exam_score ,
            semester_work_score:dto.semester_work_score ,
            total_score:rule.symbol,
          };
        }
      }
      // If NO special rule matched → invalid input
      throw new BadRequestException(
        `Invalid score symbol "${dto.final_exam_score || dto.semester_work_score}". No matching excuse/cheat rule found.`,
      );
    } else {
      // Handel Exam only Rules
      let specialRules = rules.filter((r) => ['exam'].includes(r.ruleType));
      for (const rule of specialRules) {
        if (
          Number(dto.final_exam_score) >=
            (rule.minPercentage / 100) * Number(subject.final_max_score) &&
          Number(dto.final_exam_score) <=
            (rule.maxPercentage / 100) * Number(subject.final_max_score)
        ) {
          return {
            grade: rule.symbol,
            final_exam_score: Number(dto.final_exam_score),
            semester_work_score: Number(dto.semester_work_score),
            total_score:typeof dto.semester_work_score == 'string'? Number(dto.final_exam_score):
            Number(dto.final_exam_score)+ Number(dto.semester_work_score),
          };
        }
      }

      // handel Total Rules
      specialRules = rules.filter((r) => ['total'].includes(r.ruleType));
      for (const rule of specialRules) {
        let total_score = typeof dto.semester_work_score =='string' ? Number(dto.final_exam_score):
          Number(dto.final_exam_score) + Number(dto.semester_work_score);
        if (
          total_score >= rule.minPercentage &&
          total_score <= rule.maxPercentage
        ) {
          return {
            grade: rule.symbol,
            final_exam_score: Number(dto.final_exam_score),
            semester_work_score: dto.semester_work_score,
            total_score: total_score,
          };
        }
      }
      // If NO special rule matched → invalid input
      throw new BadRequestException(
        `Invalid score symbol "${dto.final_exam_score || dto.semester_work_score}". No matching excuse/cheat rule found.`,
      );
    }
  }

  // CREATE
  async bulkCreate(dtoList: CreateGradeDto[]) {
    const transaction = await this.sequelize.transaction();

    try {
      const grades: Grade[] = [];

      // Group grades by subject to optimize DB calls:
      const subjectMap = new Map<string, Subject>();
      const sessionMap = new Map<string, ExamSession>();
      const rulesMap = new Map<string, SubjectRole[]>();

      // 1️⃣ Extract all unique combinations of user + subject + session
      const keys = dtoList.map((d) => ({
        userId: d.userId,
        subjectId: d.subjectId,
        examSessionId: d.examSessionId,
      }));

      // 2️⃣ Fetch all existing grades in **one DB query**
      const existingGrades = await this.gradeModel.findAll({
        where: {
          [Op.or]: keys.map((k) => ({
            userId: k.userId,
            subjectId: k.subjectId,
            examSessionId: k.examSessionId,
          })),
        },
      });

      // 3️⃣ Create a Set for quick in-memory lookup
      const existingSet = new Set(
        existingGrades.map(
          (g) => `${g.userId}-${g.subjectId}-${g.examSessionId}`,
        ),
      );
      for (const dto of dtoList) {
        // ---------------- check for dublicate grade ------------//
        const key = `${dto.userId}-${dto.subjectId}-${dto.examSessionId}`;
        if (existingSet.has(key)) {
          throw new BadRequestException(
            `Grade already exists for user ${dto.userId} in subject ${dto.subjectId} for exam session ${dto.examSessionId}`,
          );
        }
        // --------------- SUBJECT ----------------
        // 1️⃣ Load roles only once per subject
        if (!subjectMap.has(dto.subjectId)) {
          const subject = await Subject.findByPk(dto.subjectId);

          if (!subject) {
            throw new NotFoundException(
              `Subject with ID ${dto.subjectId} not found`,
            );
          }
          subjectMap.set(dto.subjectId, subject.dataValues);

          // 2️⃣ Load roles for this subject
          const rules = await SubjectRole.findAll({
            where: { subjectId: dto.subjectId },
          });

          if (!rules || rules.length === 0) {
            throw new NotFoundException(
              `No grading rules found for subject with ID ${dto.subjectId} and name ${subject.dataValues.name}`,
            );
          }
          let plainRules = rules.map((r) => r.get({ plain: true }));
          rulesMap.set(dto.subjectId, plainRules);
        }

        const rules = rulesMap.get(dto.subjectId)!;

        // --------------- EXAM SESSION ----------------

        if (!sessionMap.has(dto.examSessionId)) {
          // load session for this subject
          const session = await ExamSession.findByPk(dto.examSessionId);
          if (!session) {
            throw new NotFoundException(
              `No session Exam found for ExamSession with ID ${dto.examSessionId}`,
            );
          }

          sessionMap.set(dto.examSessionId, session);
        }
        // --------------- GRADE LOGIC ----------------
        let result = this.applyRules(dto, subjectMap.get(dto.subjectId), rules);

        if (result.grade == null) {
          throw new NotFoundException(
            `No Matching rule for student  in subject ${subjectMap.get(dto.subjectId)?.name}`,
          );
        } else {
          const existing = await this.gradeModel.findOne({
            where: {
              userId: dto.userId,
              subjectId: dto.subjectId,
              examSessionId: dto.examSessionId,
            },
          });

          if (existing) {
            throw new BadRequestException(
              `Grade already exists for this student in this subject for this exam session`,
            );
          }
          grades.push({
            userId: dto.userId,
            subjectId: dto.subjectId,
            examSessionId: dto.examSessionId,
            semester_work_score: dto.semester_work_score,
            final_exam_score: dto.final_exam_score,
            total_score: result.total_score,
            grade: result.grade,
          } as any);
        }
      }
      console.log(grades);
      // 🚀 TRUE BULK CREATE (only one DB insert)
      const created = await this.gradeModel.bulkCreate(grades, { transaction });
      // ------------ commit transaction --------------
      await transaction.commit();
      return created;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(query: any): Promise<any> {
    const { page = 1, limit = 10, userId, subjectId, examSessionId } = query;

    const offset = (page - 1) * limit;

    const filters: any = {};

    if (userId) filters.userId = userId;
    if (subjectId) filters.subjectId = subjectId;
    if (examSessionId) filters.examSessionId = examSessionId;

    const { rows, count } = await this.gradeModel.findAndCountAll({
      where: filters,
      include: { all: true },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      total: count,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }

  // FIND ONE
  async findOne(id: string): Promise<Grade> {
    const grade = await this.gradeModel.findByPk(id, {
      include: { all: true },
    });

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    return grade;
  }

  async bulkUpsert(dtoList: CreateGradeDto[]) {
    const grades: any[] = [];

    const subjectMap = new Map<string, Subject>();
    const sessionMap = new Map<string, ExamSession>();
    const rulesMap = new Map<string, SubjectRole[]>();

    for (const dto of dtoList) {
      // ----- SUBJECT -----

      if (!subjectMap.has(dto.subjectId)) {
        const subject = await Subject.findByPk(dto.subjectId);
        if (!subject) throw new NotFoundException(`Subject not found`);
        subjectMap.set(dto.subjectId, subject);
      }

      // ----- RULES -----
      if (!rulesMap.has(dto.subjectId)) {
        const rules = await SubjectRole.findAll({
          where: { subjectId: dto.subjectId },
        });
        if (!rules.length)
          throw new NotFoundException(`No grading rules found`);
        rulesMap.set(dto.subjectId, rules);
      }

      const rules = rulesMap.get(dto.subjectId)!;

      // ----- SESSION -----
      if (!sessionMap.has(dto.examSessionId)) {
        const session = await ExamSession.findByPk(dto.examSessionId);
        if (!session) throw new NotFoundException(`Session not found`);
        sessionMap.set(dto.examSessionId, session);
      }

      // ----- APPLY RULES -----
      const result = this.applyRules(dto, subjectMap.get(dto.subjectId), rules);
      if (!result.grade) {
        throw new NotFoundException(
          `No matching rule for student in subject ${subjectMap.get(dto.subjectId)?.name}`,
        );
      }

      grades.push({
        userId: dto.userId,
        subjectId: dto.subjectId,
        examSessionId: dto.examSessionId,
        semester_work_score: dto.semester_work_score,
        final_exam_score: dto.final_exam_score,
        score: result.total_score,
        grade: result.grade,
      });
    }

    // Upsert each grade without transaction
    const promises = grades.map(
      (g) => this.gradeModel.upsert(g), // insert or update
    );

    return await Promise.all(promises);
  }
  // DELETE
  async remove(id: string): Promise<{ message: string }> {
    const grade = await this.findOne(id);

    await grade.destroy();

    return { message: 'Grade deleted successfully' };
  }
}
