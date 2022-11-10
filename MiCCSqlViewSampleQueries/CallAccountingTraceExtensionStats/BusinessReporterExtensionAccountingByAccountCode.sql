/********************************CallAccountingTraceExtentionStats View Example************************************************************
Business Reporter Extension Accounting by Account Code Example
The Business Reporter Extension Accounting by Account Code example returns a result set equivalent to the Business Reporter Extension Accounting by Account Code report. This example also demonstrates how to convert durations into readable strings. If you want to report on alternate extensions replace the reporting number of the extension in the line ExtensionReporting = 1164.
***********************************************************************************************************************************************/
 
-- Define which database to use
USE [CCMData]
GO

SELECT
[ExtensionName]
,[ExtensionReporting]
,[AccountCode]
,[IntervalStartTime]
,[Duration]
,dbo.UDF_GetDurationASString([Duration]) AS DurationString
,[Cost]
FROM
CallAccountingTraceExtensionStats
WHERE
ExtensionReporting = 1164
AND
Len(AccountCode) > 0
AND
MidnightStartDate > 'October 1, 2022'
AND
MidnightStartDate < 'October 30, 2022'