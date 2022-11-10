/********************************AgentPerformanceByPeriodStats Example**************************************************
Employee Group Performance by Employee Example
The Employee Group Performance by Employee example returns Employee Group Performance by Employee information. To return a result set on a specific employee group, replace ‘1’ in groups.Reporting = ‘1’ with the reporting number of the employee group you want to report on.

NOTE: The collected data is aggregated by employee so that one line of data is generated for each employee. Employees that do not contain any data will not appear in the output.
**********************************************************************************************************************************/
 USE CCMData
 GO

SELECT
EmployeeReporting,
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
-- Group the results by employee
GROUP BY
EmployeeReporting