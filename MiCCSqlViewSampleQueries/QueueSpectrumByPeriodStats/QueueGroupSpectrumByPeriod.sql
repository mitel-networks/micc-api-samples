/********************************QueueSpectrumByPeriodStats Example*******************************************************************
Queue Group Spectrum by Period Example
The Queue Group Spectrum by Period example returns Queue Group Spectrum by Period information. The Queue Group Spectrum by Period example shows how to obtain:
a duration as a string
the percentage of total calls in column1 while avoiding division by zero errors.
the number of calls in a column

Results will be returned in 15 minute increments by default.

To obtain results in 30 minute increments, replace IntervalStartTime with (IntervalStartTime/2)*2.

To obtain results in 60 minute increments, replace IntervalStartTime with (IntervalStartTime/4)*4.

To return a result set on a specific queue group, replace ‘1’ in groups.Reporting = ‘1’ with the reporting number of the queue group you want to report on.

To obtain results for other spectrums, replace the StreamType = "Answer" to "Abandon", "Interflow", "Talk", or "Ringing"

NOTE: The collected data is aggregated by IntervalStartTime so that one line of data is generated for each interval with data. Intervals that do not contain any data will not appear in the output.
*************************************************************************************************************************************/ 

USE [CCMDATA] --Use the correct database.
GO

SELECT
IntervalStartTime,
-- Return a duration as a string
dbo.UDF_GetDurationASString(MAX( MaxTimeTo )) AS MaxTimeToAnswerAsString,
SUM( TotalCalls ) AS TotalCallsAnswered,
SUM( Column1Count) AS CallAnsweredColumn1Count,

-- Determine the percentage of answered calls in column 1
CASE SUM(TotalCalls)
-- Avoid dividing by zero
WHEN 0 THEN 0.0
ELSE convert(float, SUM(Column1Count))/convert(float,SUM(TotalCalls)) * 100.0 --Use Real Math
END AS CallAnsweredColumn1CountPercent,

-- Determine the number of calls in column2 (not in column1)
SUM( Column2Count ) - SUM( Column1Count ) AS CallAnsweredInColumn2AndNotInColumn1
FROM
QueueSpectrumByPeriodStats
WHERE
---- For queues that belong to the specified queue group
[QueueID]
IN (SELECT FKQueue
FROM tblConfig_QueueGroupMembers mems
INNER JOIN tblConfig_QueueGroup groups
ON mems.FKQueueGroup = groups.Pkey
WHERE groups.Reporting = '1')
AND
SpectrumType = 'Answer'
AND
MidnightStartDate > 'October 3, 2021'
AND
MidnightStartDate < 'October 4, 2022'
-- Group the results by interval start time
GROUP BY
IntervalStartTime