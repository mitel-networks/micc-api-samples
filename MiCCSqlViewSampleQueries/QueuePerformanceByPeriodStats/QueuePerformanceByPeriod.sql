/********************************QueuePerformanceByPeriodStats Example**************************************************
Queue Performance by Period Example
The Queue Performance by Period example returns a result set equivalent to the Queue Performance by Period report
************************************************************************************************************************/ 

-- Define which database to use
USE [CCMData]
GO

-- Set the report queue ID
DECLARE @QueueID AS UNIQUEIDENTIFIER
SET @QueueID = 'A207C9FE-ADE0-4BFF-AF71-C2DF9879788D'

-- Declare variables to determine the queue, date range, and time interval values the query will return.
DECLARE @StartDate AS DATETIME
DECLARE @EndDate AS DATETIME

-- Set the start date and time.
SET @StartDate = '2022-02-01 00:00:00'
 
-- Set the end date and time.
SET @EndDate = '2022-02-28 00:00:00'

-- Declare integer variables for the time intervals.
DECLARE @HighTimeIntervalID AS INT
DECLARE @LowTimeIntervalID AS INT

-- Set variables for the 15 minute intervals in a 24 hour period (where 0 represents 00:00:00 to 00:15:00 and 95 represents 23:45:00 to 00:00:00).
SET @LowTimeIntervalID = 0
SET @HighTimeIntervalID = 95

-- Declare variables
DECLARE @IncludeDataForMon BIT
DECLARE @IncludeDataForTue BIT
DECLARE @IncludeDataForWed BIT
DECLARE @IncludeDataForThu BIT
DECLARE @IncludeDataForFri BIT
DECLARE @IncludeDataForSat BIT
DECLARE @IncludeDataForSun BIT

-- Set the day variables. Each day variable must be set to 1 to be included in the report.
SET @IncludeDataForMon = 1
SET @IncludeDataForTue = 1
SET @IncludeDataForWed = 1
SET @IncludeDataForThu = 1
SET @IncludeDataForFri = 1
SET @IncludeDataForSat = 1
SET @IncludeDataForSun = 1

--Declaring an integer variable for the report period interval
DECLARE @ReportPeriodIntervalID AS INT

-- Set the report period interval variable. The @ReportPeriodIntervalID variable returns time intervals in multiples of 15 minutes. Values of 1,2,3, and 4 will return 15, 30, 45, and 60 minute time intervals respectively.
SET @ReportPeriodIntervalID = 1

-- Create a table to return rows for time intervals that do not contain any data
CREATE TABLE #tResult
(
TimeIntervalID NCHAR(5)
,Offered INT DEFAULT 0
,Answered INT DEFAULT 0
,ShortAbandon INT DEFAULT 0
,Abandoned INT DEFAULT 0
,Interflowed INT DEFAULT 0
,Requeued INT DEFAULT 0
,Unavailable INT DEFAULT 0
,AnswerBy1 INT DEFAULT 0
,AnswerBy2 INT DEFAULT 0
,AnswerBy3 INT DEFAULT 0
,AnswerBy4 INT DEFAULT 0
,AvgTTAns FLOAT DEFAULT 0
,AvgTTAbd FLOAT DEFAULT 0
,AvgTTInt FLOAT DEFAULT 0
,TotalTalk FLOAT DEFAULT 0
,AvgTalk FLOAT DEFAULT 0
,AbdPercentage FLOAT DEFAULT 0

-- Set the service level default value. If no calls are received, the service level default value is 100%
,ServiceLevel REAL DEFAULT 100
,ANSPercentage REAL DEFAULT 0
)

INSERT INTO #tResult
(
TimeIntervalID
,Offered
,Answered
,ShortAbandon
,Abandoned
,Interflowed
,Requeued
,Unavailable
,AnswerBy1
,AnswerBy2
,AnswerBy3
,AnswerBy4
,AvgTTAns
,AvgTTAbd
,AvgTTInt
,TotalTalk
,AvgTalk
,AbdPercentage
,ServiceLevel
,ANSPercentage
)
(
SELECT
(TimeIntervalID/@ReportPeriodIntervalID)*@ReportPeriodIntervalID AS TimeIntervalID
,SUM(QueueOffered) AS Offered
,SUM(QueueAnswered) AS Answered
,SUM(QueueShortAbandoned) AS ShortAbandon
,SUM(QueueAbandoned) AS Abandoned
,SUM(QueueInterflowed) AS Interflowed
,SUM(QueueRequeued) AS Requeued
,SUM(QueueUnavailable) AS Unavailable
,SUM(QueueAnswerByGroup1) AS AnswerBy1
,SUM(QueueAnswerByGroup2) AS AnswerBy2
,SUM(QueueAnswerByGroup3) AS AnswerBy3
,SUM(QueueAnswerByGroup4) AS AnswerBy4
,CASE SUM(QueueAnswered)
WHEN 0 THEN 0
ELSE IsNull(SUM(QueueTimeToAnswerTotal) / SUM(QueueAnswered),0)
END AS AvgTTAns
,CASE SUM(QueueAbandoned)
WHEN 0 THEN 0
ELSE IsNull(SUM(QueueTimeToAbandonTotal) / SUM(QueueAbandoned),0)
END AS AvgTTAbd
,CASE SUM(QueueInterflowed)
WHEN 0 THEN 0
ELSE IsNull(SUM(QueueTimeToInterflowTotal) / SUM(QueueInterflowed),0)
END AS AvgTTInt
,SUM(convert(float,QueueTotalTalkTime)) AS TotalTalk
,CASE SUM (QueueAnswered)
WHEN 0 THEN 0
ELSE IsNull(SUM(QueueTotalTalkTime) / SUM(QueueAnswered),0)
END AS AvgTalk
,CASE SUM (QueueOffered)
WHEN 0 THEN 0.0
ELSE (CONVERT(float, SUM(QueueAbandoned)) / CONVERT(float, SUM(QueueOffered))) * 100.0
END AS AbdPercentage
,CASE SUM(QueueOffered)
WHEN 0 THEN 100.0
ELSE SUM(convert(float,QueueServiceCount)) / SUM(CONVERT(float, QueueOffered)) * 100.0
END AS ServiceLevel
,CASE SUM(QueueAnswered)
WHEN 0 THEN 0.0
ELSE SUM(CONVERT(float, QueueAnswered)) / SUM(CONVERT(float, QueueOffered)) *100.0
END AS ANSPercentage
FROM
QueuePerformanceByPeriodStats
WHERE
MidnightStartDate >= @StartDate
AND
MidnightStartDate < @EndDate
AND
TimeIntervalID >= @LowTimeIntervalID
AND
TimeIntervalID <= @HighTimeIntervalID
AND
QueueID = @QueueID
AND
DayofWeekID IN
(
SELECT iDay FROM dbo.UDF_Reports_Utility_GetDays
(
@IncludeDataForMon,
@IncludeDataForTue,
@IncludeDataForWed,
@IncludeDataForThu,
@IncludeDataForFri,
@IncludeDataForSat,
@IncludeDataForSun
)
)
GROUP BY
(TimeIntervalID/@ReportPeriodIntervalID)*@ReportPeriodIntervalID
)
 
-- Insert empty rows for the time intervals that do not contain any data
-- Insert intervals into #tResult that are not already contained in the table
INSERT INTO #tResult
(#tResult.TimeIntervalID)
(SELECT DISTINCT ((tblLookup_TimeInterval.PKey/@ReportPeriodIntervalID)*@ReportPeriodIntervalID)
FROM tblLookup_TimeInterval
WHERE
(tblLookup_TimeInterval.PKey/@ReportPeriodIntervalID)*@ReportPeriodIntervalID NOT IN
(SELECT #tResult.TimeIntervalID
FROM #tResult)
)

-- Return the result set
SELECT
ti.starttime
,tr.Offered
,tr.Answered
,tr.ShortAbandon
,tr.Abandoned
,tr.Interflowed
,tr.Requeued
,tr.Unavailable
,tr.AnswerBy1
,tr.AnswerBy2
,tr.AnswerBy3
,tr.AnswerBy4
,tr.AvgTTAns
,tr.AvgTTAbd
,tr.AvgTTInt
,tr.TotalTalk
,tr.AvgTalk
,tr.AbdPercentage
,tr.ServiceLevel
,tr.ANSPercentage
FROM #tResult tr
INNER JOIN tblLookup_TimeInterval ti on tr.TimeIntervalID = ti.PKey
ORDER BY ti.starttime

-- Drop the temporary table
DROP TABLE #tResult