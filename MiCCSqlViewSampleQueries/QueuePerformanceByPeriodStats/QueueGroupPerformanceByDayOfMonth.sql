/********************************QueuePerformanceByPeriodStats Example**************************************************
Queue Group Performance by Day of Month Example

The Queue Group Performance by Day of Month example returns a result set equivalent to the Queue Group Performance by Day of Month report. To return a result set on a specific queue group, replace ‘1’ in groups.Reporting = ‘1’ with the reporting number of the queue group you want to report on.

NOTE: The collected data is aggregated by day so that one line of data is generated for each day of the month. Days that do not contain any data will not appear in the output.
**************************************************************************************************************************************/
USE CCMData
GO

SELECT
DatePart(dd, [MidnightStartDate]) AS [DayOfMonth],
SUM([QueueAnswered]) AS [TotalCallsAnswered],
SUM(QueueTotalTalkTime) AS [TotalTalkTime]
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
[MidnightStartDate] < 'October 1, 2022'

-- Group the results by the day of month
GROUP BY
DatePart(dd, [MidnightStartDate])
-- Put the days of month in sequential order.
ORDER BY
DatePart(dd, [MidnightStartDate])

