/********************************AgentEventStats Example*******************************************************************
Agent Group Event by Day of Month Example
The Agent Group Event by Day of Month example returns Agent Group Event by Day of Month information. The Agent Group Event by Day of Month example demonstrates how to convert durations into readable strings.

To return a result set on a specific agent group, replace ‘201’ in groups.Reporting = ‘201’ with the reporting number of the agent group you want to report on.

NOTE: The collected data is aggregated by day of month so that one line of data is generated for each day of the month. Days that do not contain any data will not appear in the output.
**************************************************************************************************************************************/
USE CCMData
GO

SELECT
DATEPART(DD, MidnightStartDate) AS [Day Of Month],
SUM(AgentEventACDCount) AS [ACD Count],
dbo.UDF_GetDurationASString(SUM(AgentEventACDDuration)) AS [ACD Duration]
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
-- Group the results by day of week
GROUP BY
DATEPART(dd, MidnightStartDate )