/********************************AgentPerformanceByPeriodStats Example**************************************************
Agent Performance by Period Example
The Agent Performance by Period example returns Agent Performance by Period information. This example demonstrates how to calculate an average using integer math and avoid dividing by zero. It also demonstrates how to convert durations into readable strings.

NOTE: The collected data is aggregated by period so that one line of data is generated for each period. Periods that do not contain any data will not appear in the output.
******************************************************************************************************************************/

-- Define which database to use

USE CCMDATA
GO

SELECT
IntervalStartTime,
SUM([AgentACDCount]) AS ACDCount,
SUM([AgentACDDuration])AS ACDDuration,
-- Avoid dividing by zero
CASE SUM([AgentACDCount])
-- Return zero if the quotient equals zero
WHEN 0 THEN 0

-- Returns the average of AgentACDDuration
ELSE SUM([AgentACDDuration]) / SUM([AgentACDCount])
END AS AverageACDDuration,
CASE SUM([AgentACDCount])
-- Return a string version of zero seconds
WHEN 0 THEN dbo.UDF_GetDurationASString(0)
-- Return the average duration as a string
ELSE dbo.UDF_GetDurationASString(SUM([AgentACDDuration]) / SUM([AgentACDCount]))
END AS AverageACDDurationAsString

FROM
AgentPerformanceByPeriodStats
WHERE
MidnightStartDate > 'October 3, 2022'
AND
MidnightStartDate < 'October 4, 2022'

-- Group the results by interval start time
GROUP BY
IntervalStartTime