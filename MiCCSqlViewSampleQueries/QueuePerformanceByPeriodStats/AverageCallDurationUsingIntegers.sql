/***********************QueuePerformanceByPeriodStats View Sample Query***************************************

Average Call Duration Using Integers Example
	The Average Call Duration using Integers example calculates the average duration of a queue group call or other event using integer math and returns it as a string. To return a result set on a specific queue group, replace �1� in groups.Reporting = �1� with the reporting number of the queue group you want to report on.

NOTE: The collected data is aggregated by month so that one line of data is generated for each month. Months that do not contain any data will not appear in the output.

 ************************************************************************************************************/
 
SELECT
DatePart(mm, [MidnightStartDate]) AS [Month],
SUM([QueueAnswered]) AS [TotalCallsAnswered],
SUM([QueueTotalTalkTime]) AS [TotalTalkTime],

-- Avoid dividing by zero
CASE SUM([QueueAnswered])
-- Return zero if the quotient equals zero
WHEN 0 THEN 0

-- Return the average talk duration for answered calls
ELSE SUM([QueueTotalTalkTime])/SUM([QueueAnswered])
END AS AvgQueueACDDuration,
CASE SUM([QueueAnswered])
-- Return a string version of zero seconds
WHEN 0 THEN dbo.UDF_GetDurationASString(0)
-- Return the average duration as a string
ELSE dbo.UDF_GetDurationASString(SUM([QueueTotalTalkTime])/SUM([QueueAnswered]))
END AS AvgQueueACDDurationString

FROM
QueuePerformancebyPeriodStats
WHERE
-- For queues that belong to the specified queue group
[QueueID]

IN (
	SELECT FKQueue
	FROM tblConfig_QueueGroupMembers mems
	INNER JOIN tblConfig_QueueGroup groups
	ON mems.FKQueueGroup = groups.Pkey
	WHERE groups.Reporting = '1')
	AND
	[MidnightStartDate] > 'October 3, 2022'
	AND
	[MidnightStartDate] < 'October 4, 2022'
	-- Group the results by month
	GROUP BY
	DatePart(mm, [MidnightStartDate])
	
-- Put the months in sequential order
ORDER BY
DatePart(mm, [MidnightStartDate])