/********************************QueuePerformanceByDNISStats Example**************************************************
Queue Group Spectrum by Queue Example
The Queue Group Spectrum by Queue example returns a result set equivalent to the Queue Group Spectrum by Queue report.
**********************************************************************************************************************/

--Define which database to use
USE [CCMData]
GO

-- Set the report queue group ID
DECLARE @FKDevice AS uniqueidentifier
SET @FKDevice = 'B097C8AA-8205-406C-8B2C-5311FD8DF844'

-- Declare variables to determine the queue group, date range, and time interval values the query will return.
DECLARE @StartDate AS datetime
DECLARE @EndDate AS datetime

-- Set the start date and time.
SET @StartDate = '2022-02-01 00:00:00'

-- Set the end date and time.
SET @EndDate = '2022-02-28 00:00:00'

-- Declare variables
DECLARE @IncludeDataForMon AS bit
DECLARE @IncludeDataForTue AS bit
DECLARE @IncludeDataForWed AS bit
DECLARE @IncludeDataForThu AS bit
DECLARE @IncludeDataForFri AS bit
DECLARE @IncludeDataForSat AS bit
DECLARE @IncludeDataForSun AS bit

-- Set the day variables. Each day variable must be set to 1 to be included in the report.
SET @IncludeDataForMon = 1
SET @IncludeDataForTue = 1
SET @IncludeDataForWed = 1
SET @IncludeDataForThu = 1
SET @IncludeDataForFri = 1
SET @IncludeDataForSat = 1
SET @IncludeDataForSun = 1

--Declaring an integer variable for the report period interval
DECLARE @FKHighTimeInterval AS int
DECLARE @FKLowTimeInterval AS int

-- Set variables for the 15 minute intervals in a 24 hour period (where 0 represents 00:00:00 to 00:15:00 and 95 represents 23:45:00 to 00:00:00).
SET @FKHighTimeInterval = 95
SET @FKLowTimeInterval = 0
--Declaring an integer variable for the report period interval
DECLARE @FKReportPeriodInterval AS int

-- Set the report period interval variable. The @FKReportPeriodInterval variable returns time intervals in multiples of 15 minutes. Values of 1,2,3, and 4 will return 15, 30, 45, and 60 minute time intervals respectively.
SET @FKReportPeriodInterval = 1
-- Declaring an integer variable for the spectrum type, where:
-- @FKSpectrumType = 1, then Abandon
-- @FKSpectrumType = 2, then Answer
-- @FKSpectrumType = 3, then Interflow
-- @FKSpectrumType = 4, then Talk
-- @FKSpectrumType = 5, then Ringing
DECLARE @FKSpectrumType AS int
SET @FKSpectrumType = 1

-- Create a table to return rows for time intervals that do not contain any data
CREATE TABLE #tResult
(
Reporting nvarchar(15),
FullName nvarchar(50),
Answered float DEFAULT 0,
MaxTimeTo float DEFAULT 0,
OneCount float DEFAULT 0,
OnePercent real DEFAULT 0,
TwoCount float DEFAULT 0,
twoPercent real DEFAULT 0,
threeCount float DEFAULT 0,
threePercent real DEFAULT 0,
fourCount float DEFAULT 0,
fourPercent real DEFAULT 0,
fivecount float DEFAULT 0,
fivePercent real DEFAULT 0,
sixCount float DEFAULT 0,
sixPercent real DEFAULT 0,
sevenCount float DEFAULT 0,
sevenPercent real DEFAULT 0,
eightCount float DEFAULT 0,
eightPercent real DEFAULT 0,
nineCount float DEFAULT 0,
ninePercent real DEFAULT 0,
tenCallsRemain float DEFAULT 0,
tenCallsRemainPercent real DEFAULT 0
)

INSERT INTO #tResult
(
Reporting
,FullName
,Answered
,MaxTimeTo
,OneCount
,OnePercent
,twoCount
,twoPercent
,threeCount
,threePercent
,fourCount
,fourPercent
,fivecount
,fivePercent
,sixCount
,sixPercent
,sevenCount
,sevenPercent
,eightCount
,eightPercent
,nineCount
,ninePercent
,tenCallsRemain
,tenCallsRemainPercent
)
(
SELECT
QueueReporting
,QueueName
,SUM(TotalCalls)
,MAX(MaxTimeTo)
,SUM(Column1Count)
,CASE SUM(TotalCalls)
WHEN 0 THEN 0.0
ELSE CONVERT(float,SUM(Column1Count))/CONVERT(float,SUM(TotalCalls))*100.0
END
,SUM(Column2Count)
,CASE SUM(TotalCalls)
WHEN 0 THEN 0.0
ELSE CONVERT(float,SUM(Column2Count))/CONVERT(float,SUM(TotalCalls))*100.0
END
,SUM(Column3Count)
,CASE SUM(TotalCalls)
WHEN 0 THEN 0.0
ELSE CONVERT(float,SUM(Column3Count))/CONVERT(float,SUM(TotalCalls))*100.0
END
,SUM(Column4Count)
,CASE SUM(TotalCalls)
WHEN 0 THEN 0.0
ELSE CONVERT(float,SUM(Column4Count))/CONVERT(float,SUM(TotalCalls))*100.0
END
,SUM(Column5Count)
,CASE SUM(TotalCalls)
WHEN 0 THEN 0.0
ELSE CONVERT(float,SUM(Column5Count))/CONVERT(float,SUM(TotalCalls))*100.0
END
,SUM(Column6Count)
,CASE SUM(TotalCalls)
WHEN 0 THEN 0.0
ELSE CONVERT(float,SUM(Column6Count))/CONVERT(float,SUM(TotalCalls))*100.0
END
,SUM(Column7Count)
,CASE SUM(TotalCalls)
WHEN 0 THEN 0.0
ELSE CONVERT(float,SUM(Column7Count))/CONVERT(float,SUM(TotalCalls))*100.0
END
,SUM(Column8Count)
,CASE SUM(TotalCalls)
WHEN 0 THEN 0.0
ELSE CONVERT(float,SUM(Column8Count))/CONVERT(float,SUM(TotalCalls))*100.0
END
,SUM(Column9Count)
,CASE SUM(TotalCalls)
WHEN 0 THEN 0.0
ELSE CONVERT(float,SUM(Column9Count))/CONVERT(float,SUM(TotalCalls))*100.0
END
,SUM(Column10Count)
,CASE SUM(TotalCalls)
WHEN 0 THEN 0.0
ELSE CONVERT(float,SUM(Column10Count))/CONVERT(float,SUM(TotalCalls))*100.0
END
FROM
QueueSpectrumByPeriodStats
WHERE
SpectrumTypeID = @FKSpectrumType
AND
MidnightStartDate >= @StartDate
AND
MidnightStartDate < @EndDate
AND
TimeIntervalID >= @FKLowTimeInterval
AND
TimeIntervalID <= @FKHighTimeInterval
AND
QueueID IN
(
SELECT FKQueue FROM tblConfig_QueueGroupMembers mems
WHERE mems.FKQueueGroup = @FKDevice)
AND
DayOfWeekID IN
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
QueueReporting, QueueName
)

-- Create and insert the selected queue group into a temporary table. The table contains all queues in the selected queue group.
Create Table #tGroup
(
Pkey uniqueidentifier,
Reporting nvarchar(15),
FullName nvarchar(50)
)

INSERT INTO #tGroup SELECT Pkey, Reporting, Name FROM UDF_GetQueueGroupMembers_ForMediaServerFamily(@FKDevice,1)
-- Insert empty rows for the queues that do not contain any data
-- Insert queues into #tResult that are not already contained in the table
INSERT INTO #tResult (Reporting, FullName) (Select Reporting, FullName from #tGroup where Reporting NOT IN(Select Reporting from #tResult))
SELECT *
FROM #tResult
ORDER BY Answered DESC, Reporting
 
-- Drop the temporary tables
DROP TABLE #tResult
DROP TABLE #tGroup