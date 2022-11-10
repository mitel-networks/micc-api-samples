/********************************CallAccountingTraceTrunkStats View Example************************************************************
Business Reporter Trunk Accounting by Account Code Example
The Business Reporter Trunk Accounting by Account Code example returns Trunk Accounting by Account Code information. This example also demonstrates how to convert durations into readable strings. If you want to report on alternate extensions replace the reporting number of the extension in the line TrunkReporting = 9999.
***********************************************************************************************************************************************************************************************************/

-- Define which database to use
USE [CCMData]
GO

SELECT
[TrunkName]
,[TrunkReporting]
,[AccountCode]
,[IntervalStartTime]
,[Duration]
,dbo.UDF_GetDurationASString([Duration]) AS DurationString
,[Cost]
FROM
CallAccountingTraceTrunkStats
WHERE
TrunkReporting = 9999
AND
Len(AccountCode) > 0
AND
MidnightStartDate > 'October 1, 2022'
AND
MidnightStartDate < 'October 30, 2022'