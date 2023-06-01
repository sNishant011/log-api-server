import { PipelineStage } from 'mongoose';

export const groupByTimestampPipeline: PipelineStage[] = [
  {
    $addFields: {
      parsedTimestamp: {
        $dateFromString: {
          dateString: '$timestamp',
        },
      },
    },
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: '%H:%M:00',
          date: '$parsedTimestamp',
          timezone: '+00:00',
        },
      },
      count: { $sum: 1 },
    },
  },
  {
    $sort: {
      _id: 1,
    },
  },
];

export const getAggregationPipeline = (fieldName: string): PipelineStage[] => [
  {
    $group: {
      _id: `$${fieldName}`,
      count: { $sum: 1 },
    },
  },
  {
    $project: {
      value: '$_id',
      count: 1,
      _id: 0,
    },
  },
  {
    $sort: { count: -1 },
  },
  {
    $limit: 10,
  },
];
