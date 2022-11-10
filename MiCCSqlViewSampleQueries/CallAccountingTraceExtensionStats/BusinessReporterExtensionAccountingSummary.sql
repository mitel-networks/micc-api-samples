/********************************CallAccountingTraceExtentionStats View Example************************************************************
Business Reporter Extension Accounting Summary Example
The Business Reporter Extension Accounting Summary example returns a result set equivalent to the Business Reporter Extension Accounting Summary report. If you want to report on alternate extensions replace the reporting number of the extension in the line ExtensionReporting = 1101.

NOTE: The Group By clause aggregates the data by call type so that one line of data is generated for each call type containing data. Call types without data will not appear in the output.
**********************************************************************************************************************************************/
 USE CCMData
 GO

SELECT
[CallType]
,SUM(convert(int,[PegCount])) AS PegCount
,SUM([Cost]) AS Cost
,SUM([Duration]) AS Duration
FROM
CallAccountingTraceExtensionStats
WHERE
ExtensionReporting = 1101
AND
MidnightStartDate > 'October 1, 2022'
AND
MidnightStartDate < 'October 30, 2022'
GROUP BY
CallType
ORDER BY
Cost DESC