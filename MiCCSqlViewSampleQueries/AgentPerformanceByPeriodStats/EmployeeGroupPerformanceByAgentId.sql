/********************************AgentPerformanceByPeriodStats Example**************************************************
Employee Group Performance by Agent ID Example
The Employee Group Performance by Agent ID example returns Employee Group Performance by Agent ID information. To return a result set on a specific employee group, replace ‘1’ in groups.Reporting = ‘1’ with the reporting number of the employee group you want to report on.

NOTE: The collected data is aggregated by agent ID so that one line of data is generated for each agent ID. Agent ID's that do not contain any data will not appear in the output.
************************************************************************************************************************************/
 USE CCMData
 GO

SELECT
AgentReporting,
SUM([AgentACDCount]) AS ACDCount,
SUM([AgentACDDuration])AS ACDDuration
FROM
AgentPerformanceByPeriodStats
WHERE
-- For employees that belong to the specified employee group
[EmployeeID]
IN (SELECT FKEmployee
FROM tblConfig_EmployeeGroupMembers mems
INNER JOIN tblConfig_EmployeeGroup groups
ON mems.FKEmployeeGroup = groups.Pkey
WHERE groups.Reporting = '1')
AND
MidnightStartDate > 'October 1, 2022'
AND
MidnightStartDate < 'October 30, 2022'
-- Group the results by agent
GROUP BY
AgentReporting