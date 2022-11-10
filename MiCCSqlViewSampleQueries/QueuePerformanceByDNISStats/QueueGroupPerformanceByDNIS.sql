/********************************QueuePerformanceByDNISStats Example**************************************************
Queue Group Performance by DNIS Example
The Queue Group Performance by DNIS example returns a result set equivalent to the Queue Group Performance by DNIS report. To return a result set on a specific queue, replace '1' in groups.Reporting = -- '1' with the reporting number of the queue you want to report on.

NOTE: The collected data is aggregated by DNIS so that one line is generated for each DNIS group. DNIS groups that do not contain any data will not appear in the output.
**************************************************************************************************************************************/
 USE CCMData
 GO
 
SELECT
DNISName,
SUM(Interflowed) AS Interflowed,
SUM(TimeToInterflow) AS TimeToInterflow,
MAX(MaxTimeToInterflow) AS MaxTimeToInterflow
FROM QueuePerformanceByDNISStats
WHERE
-- Perform the following for queues that belong to the specified queue group
[QueueID]
IN (SELECT FKQueue
FROM tblConfig_QueueGroupMembers mems
INNER JOIN tblConfig_QueueGroup groups
ON mems.FKQueueGroup = groups.Pkey
WHERE groups.Reporting = '1')
-- Set the date range for the result set
AND
[MidnightStartDate] >= 'March 17, 2022'
AND
[MidnightStartDate] < 'March 18, 2022'
-- Group the result set by DNIS name
GROUP BY
DNISName