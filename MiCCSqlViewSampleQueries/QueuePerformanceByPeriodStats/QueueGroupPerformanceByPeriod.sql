/********************************QueuePerformanceByPeriodStats Example**************************************************
Queue Group Performance by Period Example
The Queue Group Performance by Period example returns a result set equivalent to the Queue Group Performance by Period report. To return a result set on a specific queue group, replace ‘1’ in groups.Reporting = ‘1’ with the reporting number of the queue group you want to report on.

NOTE: Results will be returned in 15 minute increments and aggregated by time interval so that one line of data is generated for each interval. Intervals that do not contain any data will not appear in the output. To obtain results in 30 minute increments, replace IntervalStartTime with (IntervalStartTime/2)*2. To obtain results in 60 minute increments, replace IntervalStartTime with (IntervalStartTime/4)*4.
*******************************************************************************************************************************/
 USE CCMData
 GO

SELECT
[IntervalStartTime],
SUM([QueueAnswered]) AS [TotalCallsAnswered],
SUM(QueueTotalTalkTime) AS [TotalTalkTime]
FROM
QueuePerformancebyPeriodStats
WHERE
-- For queues that belong to the specified queue group
[QueueID]
IN (SELECT FKQueue
FROM tblConfig_QueueGroupMembers mems
INNER JOIN tblConfig_QueueGroup groups
ON mems.FKQueueGroup = groups.Pkey
WHERE groups.Reporting = '1')
AND
[MidnightStartDate] > 'October 3, 2022'
AND
[MidnightStartDate] < 'October 4, 2022'

-- Group the results by period
GROUP BY
[IntervalStartTime]
-- Put the time intervals in sequential order
ORDER BY
[IntervalStartTime]