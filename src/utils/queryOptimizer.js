const logger = require('./logger');

class QueryOptimizer {
  static async executeQuery(model, query, options = {}) {
    const startTime = Date.now();
    
    try {
      const result = await query.explain('executionStats');
      
      // Log slow queries
      const executionTime = Date.now() - startTime;
      if (executionTime > 1000) {
        logger.warn('Slow query detected:', {
          collection: model.collection.name,
          executionTime,
          nReturned: result.executionStats.nReturned,
          totalDocsExamined: result.executionStats.totalDocsExamined,
          indexesUsed: result.queryPlanner.winningPlan.inputStage.indexName
        });
      }

      return result;
    } catch (error) {
      logger.error('Query execution error:', error);
      throw error;
    }
  }

  static createAggregationPipeline({
    match = {},
    sort = {},
    skip = 0,
    limit = 10,
    project = null,
    lookup = null
  }) {
    const pipeline = [];

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    if (lookup) {
      pipeline.push({ $lookup: lookup });
    }

    if (project) {
      pipeline.push({ $project: project });
    }

    if (Object.keys(sort).length > 0) {
      pipeline.push({ $sort: sort });
    }

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    return pipeline;
  }
}

module.exports = QueryOptimizer;