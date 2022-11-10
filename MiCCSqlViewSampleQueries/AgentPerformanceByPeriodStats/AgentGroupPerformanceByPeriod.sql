/********************************AgentPerformanceByPeriodStats Example**************************************************
AgentGroupPerformanceByPeriod Example
The Agent Group Performance By Period example returns a result set equivalent to the Agent Group Performance by Period report.
******************************************************************************************************************************/
-- Define which database to use
USE CCMData
GO

-- Set the agent group ID

DECLARE @FKDevice AS uniqueidentifier

SET @FKDevice = '00f00fb6-87fe-46a9-b314-9b5a0ec9f368'

 

-- Declare variables to determine the queue group, date range, and time interval values the query will return

DECLARE @StartDate AS datetime

DECLARE @EndDate AS datetime
 

-- Set the start date and time
SET @StartDate = '2022-02-23 12:00:00'
-- Set the end date and time
SET @EndDate = '2022-02-28 12:00:00'

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
SET @IncludeDataForTue = 0
SET @IncludeDataForWed = 0
SET @IncludeDataForThu = 0
SET @IncludeDataForFri = 1
SET @IncludeDataForSat = 0
SET @IncludeDataForSun = 0

-- Declare integer values for the time intervals
DECLARE @FKHighTimeInterval AS int
DECLARE @FKLowTimeInterval AS int

-- Set variables for the 15 minute intervals in a 24 hour period (where 0 represents 00:00:00 to 00:15:00 and 95 represents 23:45:00 to 00:00:00).
SET @FKHighTimeInterval = 52
SET @FKLowTimeInterval = 22

--Declaring an integer variable for the report period interval
DECLARE @FKReportPeriodInterval AS int

--Set the report period interval variable. The @FKReportPeriodInterval variable returns time intervals in multiples of 15 minutes. Values of 1,2,3, and 4 will return 15, 30, 45, and 60 minute time intervals respectively.

SET @FKReportPeriodInterval = 2
--=================================================

-- Determine the number of days in the request
DECLARE @NumDays int
SELECT @NumDays = dbo.udf_CalculateNumberOfDays(
@StartDate,
@EndDate,
@IncludeDataForMon,
@IncludeDataForTue,
@IncludeDataForWed,
@IncludeDataForThu,
@IncludeDataForFri,
@IncludeDataForSat,
@IncludeDataForSun)
--=================================================

-- Create a table to return rows for time intervals that do not contain any data.

CREATE TABLE #tResult
(
TimeIntervalID int DEFAULT 0,
Answered int DEFAULT 0,
NonACDAnswered int DEFAULT 0,
Abandoned int DEFAULT 0,
Outgoing int DEFAULT 0,
Requeued int DEFAULT 0,
TransIn int DEFAULT 0,
TransOut int DEFAULT 0,
ConfCalls int DEFAULT 0,
AcctCode int DEFAULT 0,
TotalACDTalk float DEFAULT 0,
AvgTotalACDTalk float DEFAULT 0,
TotalNonACDTalk float DEFAULT 0,
AvgTotalNonACDTalk float DEFAULT 0,
TotalOutgoing float DEFAULT 0,
AvgOutgoing float DEFAULT 0,
AvgAgents float DEFAULT 0
)
 
-- Drop into the #tResult table from the base table
INSERT INTO #tResult
(
TimeIntervalID,
Answered,
NonACDAnswered,
Abandoned,
Outgoing,
Requeued,
TransIn,
TransOut,
ConfCalls,
AcctCode,
TotalACDTalk,
TotalNonACDTalk,
TotalOutgoing,
AvgTotalACDTalk,
AvgTotalNonACDTalk,
AvgOutgoing,
AvgAgents
)
(
SELECT
(data.TimeIntervalID/@FKReportPeriodInterval)*@FKReportPeriodInterval
,SUM(AgentACDCount)
,SUM(AgentNonACDCount)
,SUM(AgentAbandonCount)
,SUM(AgentOutboundCount)
,SUM(AgentRequeueCount)
,SUM(AgentTransferIn)
,SUM(AgentTransferOut)
,SUM(AgentConference)
,SUM(AgentAccountCodes) + SUM(AgentAccountCodesOutbound)
,SUM(AgentACDDuration)
,SUM(AgentNonACDDuration)
,SUM(AgentOutboundDuration)
,CASE SUM(AgentACDCount)
WHEN 0 THEN 0.0
ELSE CONVERT(float, SUM(AgentACDDuration)) / CONVERT(float, SUM(AgentACDCount))
END
,CASE SUM(AgentNonACDCount)
WHEN 0 THEN 0.0
ELSE CONVERT(float, SUM(AgentNonACDDuration)) / CONVERT(float, SUM(AgentNonACDCount))
END
,CASE SUM(AgentOutboundCount)
WHEN 0 THEN 0.0
ELSE CONVERT(float, SUM(AgentOutboundDuration)) / CONVERT(float, SUM(AgentOutboundCount))
END
,CASE SUM(@FKReportPeriodInterval*@NumDays) --If either of the denominators is 0
WHEN 0 THEN 0.0
ELSE (CONVERT(float, SUM(AgentEventShiftDuration)) / convert(float,(900*@FKReportPeriodInterval)))/Convert(float, @NumDays)
END
FROM AgentPerformanceByPeriodStats data

-- Join with AgentEventStats to get Shift duration and AvgAgents
JOIN AgentEventStats ON AgentEventStats.AgentID = data.AgentID
AND AgentEventStats.TimeIntervalID = data.TimeIntervalID
WHERE
data.MidnightStartDate >= @StartDate AND
data.MidnightStartDate < @EndDate AND
data.TimeIntervalID >= @FKLowTimeInterval AND
data.TimeIntervalID <= @FKHighTimeInterval AND
data.AgentID --For agent which are members of
IN (SELECT FKAgent
FROM tblConfig_AgentGroupMembers mems
WHERE mems.FKAgentGroup = @FKDevice) AND
data.DayOfWeekID IN
(
select iDay from dbo.UDF_Reports_Utility_GetDays
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
GROUP BY (data.TimeIntervalID/@FKReportPeriodInterval)*@FKReportPeriodInterval
)
-- Insert empty rows for the time intervals that do not contain any data
-- Insert intervals into #tResult that are not already contained in the table

INSERT INTO #tResult
(#tResult.TimeIntervalID)
(SELECT DISTINCT ((tblLookup_TimeInterval.PKey/@FKReportPeriodInterval)*@FKReportPeriodInterval)
FROM tblLookup_TimeInterval
WHERE
(tblLookup_TimeInterval.PKey/@FKReportPeriodInterval)*@FKReportPeriodInterval NOT IN
(SELECT #tResult.TimeIntervalID
FROM #tResult)
AND
PKey >= @FKLowTimeInterval AND
Pkey <= @FKHighTimeInterval
)

-- Return the result set
SELECT
ti.StartTime,
tr.Answered,
tr.NonACDAnswered,
tr.Abandoned,
tr.Outgoing,
tr.Requeued,
tr.TransIn,
tr.TransOut,
tr.ConfCalls,
tr.AcctCode,
tr.TotalACDTalk,
tr.AvgTotalACDTalk,
tr.TotalNonACDTalk,
tr.AvgTotalNonACDTalk,
tr.TotalOutgoing,
tr.AvgOutgoing,
tr.AvgAgents
FROM #tResult tr
INNER JOIN tblLookup_TimeInterval ti on tr.TimeIntervalID = ti.PKey
ORDER BY ti.starttime

-- Drop the temporary table

DROP TABLE #tResult