/********************************QueuePerformanceByDNISStats Example**************************************************
DNIS Performance by Queue Example
The DNIS Performance by Queue example returns a result set equivalent to the DNIS Performance by Queue report. To return a result set on a specific DNIS, replace '7777' in DNISReporting = '7777' with the reporting number of the DNIS you want to report on.

The DNIS Performance by Queue example also demonstrates how to calculate a service percentage using real numbers.

NOTE: The collected data is aggregated by queue so that one line is generated for each queue. Queues that do not contain any data will not appear in the output.
**************************************************************************************************************************************/USE CCMData
  GO

SELECT
QueueName,
SUM(Abandoned) AS Abandoned,
SUM(ServiceCount) AS ServiceCount,
SUM(Offered) AS Offered,
-- Avoid dividing by zero
CASE SUM(Offered)
-- If no calls were received, set the serviced calls percentage to 100%
WHEN 0 THEN 100.0
-- Use real numbers to determine the percentage of calls serviced
ELSE CONVERT(float, SUM(ServiceCount)) / CONVERT (float, SUM(Offered)) * 100.0
END AS ServicePercentage
FROM
QueuePerformanceByDNISStats
WHERE
-- Set the DNIS number (7777) and date range for the result set
DNISReporting = '7777'
AND
[MidnightStartDate] >= 'March 17, 2022'
AND
[MidnightStartDate] < 'March 18, 2022'
-- Group the result set by queue name
GROUP BY
QueueName