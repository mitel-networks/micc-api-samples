/********************************QueuePerformanceByDNISStats Example**************************************************
DNIS Group Performance by Queue Example
The DNIS Group Performance by Queue example returns a result set equivalent to the DNIS Group Performance by Queue report. To return a result set on a specific DNIS group, replace '1' in groups.Reporting = '1' with the reporting number of the DNIS group you want to report on.

The DNIS Group Performance by Queue example also demonstrates how to calculate an average using integer math and real numbers, while avoiding division by zero.

NOTE: The collected data is aggregated by queue so that one line is generated for each queue in the group. Queue groups that do not contain any data will not appear in the output.
*************************************************************************************************************************************/ 
USE CCMData
GO

SELECT
QueueName,
MAX(ACDMaxTimeToAnswer) AS MaximumTimeToAnswer,
-- Avoid dividing by zero
CASE SUM(ACDCount)
WHEN 0 THEN 0
-- Use integer math to determine the average
ELSE SUM(ACDDuration)/SUM(ACDCount)
END AS AverageACDDurationUsingIntegerMath,
-- Avoid dividing by zero
CASE SUM(ACDCount)
WHEN 0 THEN 0.0
-- Use real numbers to determine the average
ELSE CONVERT(float, SUM(ACDDuration))/CONVERT(float, SUM(ACDCount))
END AS AverageACDDurationUsingRealMath
FROM
QueuePerformanceByDNISStats
WHERE
-- Perform the following for DNIS numbers that belong to the specified DNIS group
DNISID
IN (SELECT FKDNIS
FROM tblConfig_DNISGroupMembers mems
INNER JOIN tblConfig_DNISGroup groups
ON mems.FKDNISGroup = groups.Pkey
WHERE groups.Reporting = '1')
-- Set the date range for the result set
AND
[MidnightStartDate] >= 'March 17, 2022'
AND
[MidnightStartDate] < 'March 18, 2022'
-- Group the result set by queue name
GROUP BY
QueueName