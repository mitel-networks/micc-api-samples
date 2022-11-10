/********************************AgentEventStats Example*******************************************************************
Agent Group Event by Period Example
The Agent Group Event by Period example returns a result set equivalent to the Agent Group Event by Period report.
*************************************************************************************************************************/ 

USE [CCMData] --Use the correct database
GO


-- Set the agent group ID
DECLARE @FKDevice AS uniqueidentifier
SET @FKDevice = '69D4AAE9-7885-4F01-AEE8-E8B4687ABB5E'

-- Declare variables to determine the queue group, date range, and time interval values the query will return
DECLARE @StartDate AS datetime
DECLARE @EndDate AS datetime

-- Set the start date and time
SET @StartDate = '2022-02-01 00:00:00'
-- Set the end date and time
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

-- Declare integer values for the time intervals
DECLARE @FKHighTimeInterval AS int
DECLARE @FKLowTimeInterval AS int
-- Set variables for the 15 minute intervals in a 24 hour period (where 0 represents 00:00:00 to 00:15:00 and 95 represents 23:45:00 to 00:00:00).
SET @FKHighTimeInterval = 95
SET @FKLowTimeInterval = 0

--Declaring an integer variable for the report period interval
DECLARE @FKReportPeriodInterval AS int

-- Set the report period interval variable. The @FKReportPeriodInterval variable returns time intervals in multiples of 15 minutes. Values of 1,2,3, and 4 will return 15, 30, 45, and 60 minute time intervals respectively.

SET @FKReportPeriodInterval = 1

-- Create a table to return rows for time intervals that do not contain any data.

Create Table #tGroup
(
Pkey uniqueidentifier,
Reporting nvarchar(15),
FullName nvarchar(50)
)

INSERT INTO #tGroup SELECT Pkey, Reporting, Name FROM UDF_GetAgentGroupMembers(@FKDevice)
-- Create a table to return rows for time intervals that do not contain any data.
CREATE TABLE #tResult
(
Agent uniqueidentifier,
Login datetime,
Logout datetime,
ShiftDuration float DEFAULT 0,
IdleTime float DEFAULT 0,
AvgRingingTime float default 0,
TotalACDCallCount float DEFAULT 0,
ACDDurationless20 float DEFAULT 0,
ACDDuration float DEFAULT 0,
AvgACDDuration float DEFAULT 0,
CallsPerHour float default 0,
WrapUpDuration float DEFAULT 0,
AvgWrap float DEFAULT 0,
NonACDDuration float DEFAULT 0,
NonACDCallCount float DEFAULT 0,
OutDuration float DEFAULT 0,
OutCallCount float DEFAULT 0,
AllHold float DEFAULT 0,
AvgAllHold float default 0,
MakeBusyDuration float DEFAULT 0,
AvgMakeBusyDuration float DEFAULT 0,
MakeBusyCount float DEFAULT 0,
DNDDuration float DEFAULT 0,
AvgDND float DEFAULT 0,
DNDCount float DEFAULT 0,
Occupancy float default 0,
ACDHoldDuration float DEFAULT 0,
NonACDHoldDuration float DEFAULT 0,
OutHoldDuration float DEFAULT 0,
ACDHoldCount int DEFAULT 0,
NonACDHoldCount int DEFAULT 0,
OutHoldCount int DEFAULT 0,
AllHoldCount int DEFAULT 0,
RingingTime float default 0,
RingingCount float default 0
)

-- Drop into the #tResult table from the base table
INSERT INTO #tResult
(
Agent,
Login,
Logout,
ShiftDuration,
IdleTime,
AvgRingingTime,
TotalACDCallCount,
ACDDurationless20,
ACDDuration,
AvgACDDuration,
CallsPerHour,
WrapUpDuration,
AvgWrap,
NonACDDuration,
NonACDCallCount,
OutDuration,
OutCallCount,
AllHold,
AvgAllHold,
AllHoldCount,
MakeBusyDuration,
AvgMakeBusyDuration,
MakeBusyCount ,
DNDDuration ,
AvgDND,
DNDCount
)
(
SELECT 
AgentID
,MIN(AgentEventLoginTime)
,MAX(AgentEventLogoutTime)
,SUM(AgentEventShiftDuration)
,CASE 
--When denominator is 0, return 0
WHEN SUM(AgentEventShiftDuration) = 0 THEN 0

--When idle is negative, return 0
WHEN SUM(AgentEventShiftDuration) < ( SUM(AgentEventACDDuration)+ SUM(AgentEventNonACDDuration) + SUM(AgentEventOutboundDuration) + SUM(AgentEventWrapUpDuration) + SUM(AgentEventMakeBusyDuration) + SUM(AgentEventACDHoldDuration) + SUM(AgentEventNonACDHoldDuration) + SUM(AgentEventOutboundHoldDuration) ) THEN 0

ELSE SUM(AgentEventShiftDuration) - ( SUM(AgentEventACDDuration)+ SUM(AgentEventNonACDDuration) + SUM(AgentEventOutboundDuration) + SUM(AgentEventWrapUpDuration) + SUM(AgentEventMakeBusyDuration) + SUM(AgentEventACDHoldDuration) + SUM(AgentEventNonACDHoldDuration) + SUM(AgentEventOutboundHoldDuration) )
END
,CASE SUM(AgentEventRingingCount)
WHEN 0 THEN 0
ELSE CONVERT(float, SUM(AgentEventRingingDuration)) / CONVERT(float, SUM(AgentEventRingingCount))
END

,SUM(AgentEventACDCount)
,SUM(AgentEventACDShort)
,SUM(AgentEventACDDuration)
,CASE SUM(AgentEventACDCount)

WHEN 0 THEN 0
ELSE CONVERT(float, SUM(AgentEventACDDuration)) / CONVERT(float, SUM(AgentEventACDCount))
END
,CASE SUM(AgentEventShiftDuration)
WHEN 0 THEN 0
ELSE CONVERT(float, SUM(AgentEventACDCount) - SUM(AgentEventACDShort)) / ((CONVERT(float, SUM(AgentEventShiftDuration))/60)/60)
END
,SUM(AgentEventWrapUpDuration)
,CASE SUM(AgentEventACDCount)
WHEN 0 THEN 0
ELSE CONVERT(float, SUM(AgentEventWrapUpDuration)) / CONVERT(float, SUM(AgentEventACDCount))
END

,SUM(AgentEventNonACDDuration)
,SUM(AgentEventNonACDCount)
,SUM(AgentEventOutboundDuration)
,SUM(AgentEventOutboundCount)
,( SUM(AgentEventACDHoldDuration) + SUM(AgentEventNonACDHoldDuration) + SUM(AgentEventOutboundHoldDuration) )
,CASE ( SUM(AgentEventACDHoldCount) + SUM(AgentEventNonACDHoldCount) + SUM(AgentEventOutboundHoldCount) )
WHEN 0 THEN 0
ELSE CONVERT(float, ( SUM(AgentEventACDHoldDuration) + SUM(AgentEventNonACDHoldDuration) + SUM(AgentEventOutboundHoldDuration) )) / CONVERT(float, ( SUM(AgentEventACDHoldCount) + SUM(AgentEventNonACDHoldCount) + SUM(AgentEventOutboundHoldCount) ))
END
,( SUM(AgentEventACDHoldCount) + SUM(AgentEventNonACDHoldCount) + SUM(AgentEventOutboundHoldCount) )
,SUM(AgentEventMakeBusyDuration)
,CASE SUM(AgentEventMakeBusyCount)
WHEN 0 THEN 0
ELSE CONVERT(float, SUM(AgentEventMakeBusyDuration)) / CONVERT(float, SUM(AgentEventMakeBusyCount))
END
,SUM(AgentEventMakeBusyCount)
,SUM(AgentEventDNDDuration)
,CASE SUM(AgentEventDNDCount)
WHEN 0 THEN 0
ELSE CONVERT(float, SUM(AgentEventDNDDuration)) / CONVERT(float, SUM(AgentEventDNDCount))
END
,SUM(AgentEventDNDCount)
FROM AgentEventStats
WHERE
AgentEventLoginTime >= @StartDate
AND
AgentEventLogoutTime < @EndDate
AND
AgentID
IN (SELECT FKAgent
FROM tblConfig_AgentGroupMembers mems
WHERE mems.FKAgentGroup = @FKDevice) AND
DayOfWeekID IN
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
GROUP BY
AgentID
)

UPDATE #tResult
SET Occupancy = CASE ShiftDuration
WHEN 0 THEN 0
ELSE CONVERT(float, ShiftDuration - IdleTime) / CONVERT(float, ShiftDuration) * 100
END

-- Return the result set
SELECT
tg.Reporting
,tg.fullName
,t.Login
,t.Logout
,t.ShiftDuration
,t.IdleTime
,t.AvgRingingTime
,t.TotalACDCallCount
,t.ACDDurationless20
,t.ACDDuration
,t.AvgACDDuration
,t.AvgACDDuration
,t.CallsPerHour
,t.WrapUpDuration
,t.AvgWrap
,t.NonACDDuration
,t.NonACDCallCount
,t.OutDuration
,t.OutCallCount
,t.AllHold
,t.AvgAllHold
,t.AllHoldCount
,t.MakeBusyDuration
,t.AvgMakeBusyDuration
,t.MakeBusyCount
,t.DNDDuration
,t.AvgDND
,t.DNDCount
,t.Occupancy
FROM #tResult t
INNER JOIN
#tGroup tg on tg.Pkey = t.Agent
ORDER BY
tg.Reporting

--Drop the temporary tables
DROP TABLE #tResult
DROP TABLE #tGroup