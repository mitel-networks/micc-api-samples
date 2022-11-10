/********************************QueueSpectrumByPeriodStats Example*******************************************************************
Queue Group Spectrum by Day of Week Example
The Queue Group Spectrum by Day of Week example returns Queue Group Spectrum by Day of Week information. To return a result set on a specific queue group, replace ‘1’ in groups.Reporting = ‘1’ with the reporting number of the queue group you want to report on.

To obtain results for other spectrums, replace the StreamType = "Talk" with "Abandon", "Answer", "Interflow", or "Ringing"

NOTE: The collected data is aggregated by day of week so that one line of data is generated for each day of the week. Days that do not contain any data will not appear in the output.
**************************************************************************************************************************************/
USE CCMData
GO

SELECT
DayOfWeekName,
DayOfWeekID,
MAX( MaxTimeTo ) AS MaxTimeToInterflow,
SUM( TotalCalls ) AS TotalCallsInterflow
FROM
QueueSpectrumByPeriodStats
WHERE
-- For queues belonging to this queue group
[QueueID]
IN (SELECT FKQueue
FROM tblConfig_QueueGroupMembers mems
INNER JOIN tblConfig_QueueGroup groups
ON mems.FKQueueGroup = groups.Pkey
WHERE groups.Reporting = '1')
AND
SpectrumType = 'Interflow'
AND
MidnightStartDate > 'October 1, 2021'
AND
MidnightStartDate < 'October 30, 2022'
-- Group the results by day of week
GROUP BY
DayOfWeekName, DayOfWeekID
-- -- Put the days in sequential order
ORDER BY
DayOfWeekID