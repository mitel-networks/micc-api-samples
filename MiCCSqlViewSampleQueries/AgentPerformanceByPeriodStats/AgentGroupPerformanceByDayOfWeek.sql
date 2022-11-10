/********************************AgentPerformanceByPeriodStats Example**************************************************
Agent Group Performance by Day of Week Example
The Agent Group Performance by Day of Week example returns Agent Group Performance by Day of Week information. This example demonstrates how to calculate an average using real numbers and avoid dividing by zero. It also demonstrates how to convert durations into readable strings. To return a result set on a specific agent group, replace ‘1’ in groups.Reporting = ‘1’ with the reporting number of the agent group you want to report on.

NOTE: The collected data is aggregated by day of week so that one line of data is generated for each day of the week. Days that do not contain any data will not appear in the output.
**************************************************************************************************************************************/
 USE CCMData
 GO


SELECT
DayOfWeekName, DayOfWeekID,
SUM([AgentACDCount]) AS ACDCount,
SUM([AgentACDDuration])AS ACDDuration,
-- Avoid dividing by zero
CASE SUM([AgentACDCount])
-- Return zero if the quotient equals zero
WHEN 0 THEN 0
-- Return the average of AgentACDDuration
ELSE convert(float,SUM([AgentACDDuration])) / convert(float,SUM([AgentACDCount]))
END AS AverageACDDuration
FROM
AgentPerformanceByPeriodStats
WHERE
-- For agents that belong to the specified agent group
[AgentID]
IN (SELECT FKAgent
FROM tblConfig_AgentGroupMembers mems
INNER JOIN tblConfig_AgentGroup groups
ON mems.FKAgentGroup = groups.Pkey
WHERE groups.Reporting = '201')
AND
MidnightStartDate > 'October 1, 2022'
AND
MidnightStartDate < 'October 30, 2022'
-- Group the results by day of week
GROUP BY
DayOfWeekName, DayOfWeekID
-- Put the days in sequential order
ORDER BY
DayOfWeekID
