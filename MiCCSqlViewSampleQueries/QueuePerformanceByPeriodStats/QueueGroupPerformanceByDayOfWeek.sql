/********************************QueuePerformanceByPeriodStats Example**************************************************
Queue Group Performance by Day of Week Example

The Queue Group Performance by Day of Week example returns a result set equivalent to the Queue Group Performance by Day of Week report. To return a result set on a specific queue group, replace ‘1’ in groups.Reporting = ‘1’ with the reporting number of the queue group you want to report on.

NOTE: The collected data is aggregated by day of week so that one line of data is generated for each day. Days that do not contain any data will not appear in the output.
*************************************************************************************************************************************/
 
USE CCMData
GO

SELECT
[DayOfWeekName],
SUM([QueueAnswered]) AS [TotalCallsAnswered],
SUM([QueueTotalTalkTime]) AS [TotalTalkTime]
FROM
QueuePerformancebyPeriodStats
WHERE
-- For queues that belong to the specified Queue Group
[QueueID]
IN (SELECT FKQueue
FROM tblConfig_QueueGroupMembers mems
INNER JOIN tblConfig_QueueGroup groups
ON mems.FKQueueGroup = groups.Pkey
WHERE groups.Reporting = '1')
AND
[MidnightStartDate] > 'October 1, 2022'
AND
[MidnightStartDate] < 'October 30, 2022'
-- Group the results by day of the week
GROUP BY
[DayOfWeekName]