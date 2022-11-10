/********************************QueuePerformanceByDNISStats Example**************************************************
Queue Performance by DNIS Example
The Queue Performance by DNIS example returns a result set equivalent to the Queue Performance by DNIS report. To return a result set on a specific queue, replace 'P192' in QueueReporting = 'P192' with the reporting number of the queue you want to report on.

The Queue Performance by DNIS example also demonstrates how to convert a duration (in seconds) into a readable string.

NOTE: The collected data is aggregated by DNIS so that one line is generated for each DNIS. DNIS that do not contain any data will not appear in the output.
**************************************************************************************************************************************/
-- Define which database to use
USE CCMDATA
GO
 
SELECT
DNISName,
SUM(ACDCount) AS ACDCount,
SUM(ACDDuration) AS ACDDurationInSeconds,
-- Convert the duration to a string value
dbo.UDF_GetDurationASString(SUM(ACDDuration)) AS ACDDurationString
FROM
QueuePerformanceByDNISStats
WHERE
-- Set the queue (P192) and date range for the result set.
QueueReporting = 'P192'
AND
[MidnightStartDate] >= 'March 17, 2022'
AND
[MidnightStartDate] < 'March 18, 2022'
-- Group the result set by DNIS name
GROUP BY
DNISName