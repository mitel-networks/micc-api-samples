/********************************AgentEventStats Example*******************************************************************
Agent Events By Period Example
The Agent Events by Period example returns Agent Events by Period information. This example demonstrates how to calculate an average using integer math and avoid dividing by zero. It also demonstrates how to convert durations into readable strings.

NOTE: The collected data is aggregated by period so that one line of data is generated for each period. Periods that do not contain any data will not appear in the output.
**************************************************************************************************************************************/ 
USE CCMData
GO

SELECT
IntervalStartTime,
SUM(AgentEventACDCount) AS [ACD Count],
-- Convert the ACD duration to a string
dbo.UDF_GetDurationASString(SUM(AgentEventACDDuration)) AS [ACD Duration],
CASE SUM(AgentEventACDHoldCount)
-- Avoid division by zero
WHEN 0 THEN 0
ELSE SUM(AgentEventACDHoldDuration) / SUM(AgentEventACDHoldCount)
END AS [Average ACD Hold Duration]

FROM
AgentEventStats
WHERE
MidnightStartDate > 'October 3, 2022'
AND
MidnightStartDate < 'October 4, 2022'

-- Group the results by interval start time
GROUP BY
IntervalStartTime