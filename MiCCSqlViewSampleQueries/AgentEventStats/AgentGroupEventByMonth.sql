/********************************AgentEventStats Example*******************************************************************
Agent Group Event by Month Example
The Agent Group Event by Month example returns Agent Group Event by Month information. This example demonstrates how to convert durations into readable strings.

To return a result set on a specific agent group, replace ‘201’ in groups.Reporting = ‘201’ with the reporting number of the agent group you want to report on.

NOTE: The collected data is aggregated by month so that one line of data is generated for each month. Months that do not contain any data will not appear in the output.
****************************************************************************************************************************************/
USE CCMData
GO

SELECT
DATEPART(MM,MidnightStartDate) AS [Month],
SUM(AgentEventACDCount) AS [ACD Count],
dbo.UDF_GetDurationASString(SUM(AgentEventACDDuration)) AS [ACD Duration] --Get the ACD Duration as a String
FROM
AgentEventStats
WHERE
-- For agents that belong to the specified agent group
[AgentID]
IN (SELECT FKAgent
FROM tblConfig_AgentGroupMembers mems
INNER JOIN tblConfig_AgentGroup groups
ON mems.FKAgentGroup = groups.Pkey
WHERE groups.Reporting = '201')
AND
MidnightStartDate > 'October 3, 2022'
AND
MidnightStartDate < 'October 4, 2022'
-- Group the results by month
GROUP BY
DATEPART(mm,MidnightStartDate)
