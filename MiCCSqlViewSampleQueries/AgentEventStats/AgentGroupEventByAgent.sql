/********************************AgentEventStats Example*******************************************************************
Agent Group Event by Agent Example
The Agent Group Event by Agent example returns Agent Group Event by Agent information. To return a result set on a specific agent group, replace ‘201’ in groups.Reporting = ‘201’ with the reporting number of the agent group you want to report on.

NOTE: The collected data is aggregated by agent so that one line of data is generated for each agent. Agents that do not contain any data will not appear in the output.
****************************************************************************************************************************************/
 USE CCMData
 GO

SELECT
AgentID,
AgentFirstName + ' ' + AgentLastName AS [Agent Full Name],
SUM(AgentEventACDCount) AS [ACD Count],
SUM(AgentEventACDDuration) AS [ACD Duration]
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
-- Group the results by agent
GROUP BY
AgentID, AgentFirstName + ' ' + AgentLastName
