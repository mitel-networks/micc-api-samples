/********************************QueuePerformanceByPeriodStats Example**************************************************
Queue Group Performance by Queue Example
The Queue Group Performance by Queue example returns a result set equivalent to the Queue Group Performance by Queue report. To return a result set on a specific queue group, replace ‘1’ in groups.Reporting = ‘1’ with the reporting number of the queue group you want to report on.

NOTE: Queue group members that do not contain any data will not appear in the output.
***************************************************************************************************************************/

-- Define which database to use
USE [CCMDATA]
GO

SELECT
[QueueName],
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

-- Group the results by queue
GROUP BY
[QueueName]