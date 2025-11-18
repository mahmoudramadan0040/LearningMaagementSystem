import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { ReportQueryDto } from './dto/report-query.dto';
import { ReportConfig } from './interfaces/report-config.interface';

@Injectable()
export class ReportService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}
  private getRepository(model: any) {
    // Use sequelize.model() to retrieve a model by name or pass the model class directly.
    // Adjust implementation for your app's setup.
    return this.sequelize.model(model.name ?? model);
  }

  // Build `where` based on allowedFilters and query params
  private buildWhere(query: any, config: ReportConfig) {
    const where: any = {};

    if (!config.allowedFilters) return where;

    for (const key of config.allowedFilters) {
      const val = query[key];
      if (val === undefined) continue;

      // simple number range support for min/max patterns
      if (key === 'minScore' && query.minScore !== undefined) {
        where['score'] = where['score'] || {};
        where['score'][Op.gte] = Number(query.minScore);
        continue;
      }
      if (key === 'maxScore' && query.maxScore !== undefined) {
        where['score'] = where['score'] || {};
        where['score'][Op.lte] = Number(query.maxScore);
        continue;
      }

      // default equality
      where[key] = val;
    }

    // optional simple `search` across a set of fields (if provided in query.search)
    if (query.search && typeof query.search === 'string') {
      // example: search in Student name if relation exists — this is customizable
      // leaving as placeholder; specific configs may provide their own search logic
    }

    return where;
  }

  async run(
    config: ReportConfig,
    query: any,
  ): Promise<{ rows: any[]; count: number }> {
    const repo = this.getRepository(config.model);

    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.max(Number(query.limit || 10), 1);
    const offset = (page - 1) * limit;

    const eager = query.eager === 'true';

    const where = this.buildWhere(query, config);

    // build include only if eager is true
    const include =
      eager && config.relations
        ? config.relations.map((r) => {
            const inc: any = { model: r.model };
            if (r.attributes) inc.attributes = r.attributes;
            if (r.as) inc.as = r.as;
            if (r.required !== undefined) inc.required = r.required;
            if (r.include) inc.include = r.include;
            return inc;
          })
        : [];

    // order
    let order: any[] = [];
    if (query.orderBy) {
      const [col, dir] = (query.orderBy as string).split(':');
      order = [[col, (dir || 'ASC').toUpperCase()]];
    } else if (config.defaultOrder) {
      order = [config.defaultOrder];
    }

    const result = await repo.findAndCountAll({
      where,
      include,
      order,
      limit,
      offset,
      attributes: config.columns,
    });

    return { rows: result.rows, count: result.count };
  }
}
